package it.planetek.saimon.zip;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
* 
* @author M. Cosmai
*
*/
public class DownloadZipCreator  implements Callable 
{
	private static final Logger log = LoggerFactory.getLogger(DownloadZipCreator.class);

	private Properties wqProps;
	
	/**
	* Compressione prodotti SAIMON
	* 
	* @param SAIMON_Product		Path completo del file prodotto da compattare 
	* @return output 			URL http di download del file
	* @throws IOException 
	* 
	*/
	public String zip(String SAIMON_Product) throws IOException
	{
		byte[] buffer = new byte[1024];
    	String MD_ZipFileName="";
    	String ZipFolder = 	wqProps.getProperty("download.zipfolder");
    	String WebFolder = wqProps.getProperty("download.webURL");
    	
    	String SAIMON_Product_fileName = Paths.get(SAIMON_Product).getFileName().toString();
    	String SAIMON_Product_without_ext = SAIMON_Product_fileName.substring(0, SAIMON_Product_fileName.lastIndexOf('.'));
    	
    	
    	
    	
    	
    	
    	
    	String SAIMON_Product_type = SAIMON_Product_without_ext.contains("Chl") ? "Chl" : (SAIMON_Product_without_ext.contains("SST") ? "SST" : "WT");
    	String SAIMON_Legenda = "/legenda/Legend_"+SAIMON_Product_type+".png";
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	MD_ZipFileName = ZipFolder + SAIMON_Product_without_ext + ".zip"; 
    	
    	try {
    		log.info("Product file: " + SAIMON_Product);
    		log.info("Legenda file: " + SAIMON_Legenda);
    		log.info("Output zip file: " + MD_ZipFileName);
    		
    		FileOutputStream fos = new FileOutputStream(MD_ZipFileName);
    		ZipOutputStream zos = new ZipOutputStream(fos);
    		ZipEntry ze= new ZipEntry(SAIMON_Product_fileName);
    		zos.putNextEntry(ze);
    		FileInputStream in = new FileInputStream(SAIMON_Product);
    		
    		int len;
    		while ((len = in.read(buffer)) > 0) {
    			zos.write(buffer, 0, len);
    		}
    		in.close();
    		zos.closeEntry();
    		//Compressione file legenda
    		ZipEntry ze1= new ZipEntry("Legenda.png");
    		
    		zos.putNextEntry(ze1);
    		InputStream in1 = getClass().getResourceAsStream(SAIMON_Legenda);
    		
    		int len1;
    		while ((len1 = in1.read(buffer)) > 0) {
    			zos.write(buffer, 0, len1);
    		}
    		in1.close();
    		zos.closeEntry();
    		zos.close();
    		
    	} catch(IOException ex) {
    	   ex.printStackTrace();
    	   throw ex;
    	}
    	
    	return WebFolder + SAIMON_Product_without_ext + ".zip";
	}


	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{
		wqProps = eventContext.getMuleContext().getRegistry().get("wqProps");

		String SAIMON_Product = eventContext.getMessage().getProperty("wqModisOutLocalFullPath", PropertyScope.INVOCATION);
		
		return zip(SAIMON_Product);
	}
	
	
}