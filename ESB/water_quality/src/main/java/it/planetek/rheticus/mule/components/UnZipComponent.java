package it.planetek.rheticus.mule.components;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.io.IOUtils;
import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UnZipComponent implements Callable {

	private static final Logger log = LoggerFactory
			.getLogger(UnZipComponent.class);

	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{
		Properties wqProps = eventContext.getMuleContext().getRegistry().get("wqProps");

		String zipName = eventContext.getMessage().getProperty("zipName", PropertyScope.INVOCATION);
		String downloadDir = wqProps.getProperty("wqsen1.download.dir");
		
		// Out value, path of the extracted *.shp file
		String shpFilePath = "";

		// Save HTTP inputstream zip download to file in downloadDir
		File outArchive = new File(downloadDir, zipName);
		OutputStream safeOut = new FileOutputStream(outArchive);
		log.info("Saving " + zipName + "...");
		IOUtils.copy(new BufferedInputStream((InputStream) eventContext
				.getMessage().getPayload()), safeOut);
		IOUtils.closeQuietly(safeOut);
		
		// Unzip and then delete the zip file
		unzip(outArchive.getPath(), downloadDir);
		outArchive.delete();
		
		// Find the *.shp file among the extracted ones
		File[] shpFiles = new File(downloadDir, zipName.substring(0, zipName.lastIndexOf('.')) ).listFiles(new FilenameFilter() { 
    	         public boolean accept(File dir, String filename)
    	              { return filename.endsWith(".shp"); }
    	} );
		shpFilePath = shpFiles[0].getAbsolutePath();

		
		log.info("Extraction completed in " + downloadDir);
		log.info("Extracted *.shp file: " + shpFilePath);

		return shpFilePath;
	}
	
	private static FileSystem createZipFileSystem(String zipFilename, boolean create) throws IOException
	{
		// convert the filename to a URI
		final Path path = Paths.get(zipFilename);
		final URI uri = URI.create("jar:file:" + path.toUri().getPath());
		
		final Map<String, String> env = new HashMap<String, String>();
		if (create)
		{
			env.put("create", "true");
		}
		return FileSystems.newFileSystem(uri, env);
	}

	private static void unzip(String zipFilename, String destDirname) throws IOException
	{
		final Path destDir = Paths.get(destDirname);
		// if the destination doesn't exist, create it
		if (Files.notExists(destDir))
		{
			System.out.println(destDir + " does not exist. Creating...");
			Files.createDirectories(destDir);
		}

		try (FileSystem zipFileSystem = createZipFileSystem(zipFilename, false)) {
			final Path root = zipFileSystem.getPath("/");

			// walk the zip file tree and copy files to the destination
			Files.walkFileTree(root, new SimpleFileVisitor<Path>() {
				@Override
				public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException
				{
					final Path destFile = Paths.get(destDir.toString(), file.toString());
					System.out.printf("Extracting file %s to %s\n", file, destFile);
					Files.copy(file, destFile, StandardCopyOption.REPLACE_EXISTING);
					
					return FileVisitResult.CONTINUE;
				}

				@Override
				public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException
				{
					final Path dirToCreate = Paths.get(destDir.toString(), dir.toString());
					if (Files.notExists(dirToCreate))
					{
						System.out.printf("Creating directory %s\n", dirToCreate);
						Files.createDirectory(dirToCreate);
					}
					return FileVisitResult.CONTINUE;
				}
			});
		}
	}

}
