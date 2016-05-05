package it.planetek.saimon.zip;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;

/**
* 
* @author M. Cosmai
*
*/
public class compressor  implements Callable 
{	
	
	Properties wqProps;
	
	
   //Constructor
	public compressor(){
		
	
		
		
	}
	
	
	/**
	* Compressione prodotti SAIMON
	* 
	* @param SAIMON_Product		Path completo del file prodotto da compattare 
	* @param SAIMON_Legenda		Path completo del file legenda da compattare 
	* @return output 			URL http di download del file
	* 
	*/
	public String zip(String SAIMON_Product, String SAIMON_Legenda)
	{ 
    	
		
		byte[] buffer = new byte[1024];
    	String MD_ZipFileName="";
    	String ZipFolder = 	wqProps.getProperty("download.zipfolder");
    	String WebFolder = wqProps.getProperty("download.webURL");
    	String WebFullAddress = "";
    	
    	String[] parts = SAIMON_Product.split("\\\\");
    	String SAIMON_Product_fileName = parts[parts.length-1];
    	
    	String[] parts1= SAIMON_Product_fileName.split("\\.");
    	String SAIMON_Product_without_ext = parts1[0];
    	
    	MD_ZipFileName = ZipFolder + SAIMON_Product_without_ext + ".zip"; 
    	
    	try{
    		System.out.println("Product file : " + SAIMON_Product);
    		System.out.println("Legenda file : " + SAIMON_Legenda);
    		
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
    		FileInputStream in1 = new FileInputStream(SAIMON_Legenda);
    		
    		int len1;
    		while ((len1 = in1.read(buffer)) > 0) {
    			zos.write(buffer, 0, len1);
    		}
    		in1.close();
    		zos.closeEntry();
    		zos.close();
    		
    	}catch(IOException ex){
    	   ex.printStackTrace();
    		
    	}
    	
    	WebFullAddress = WebFolder + SAIMON_Product_without_ext + ".zip";
    	return WebFullAddress;
	}


	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception {
		// TODO Auto-generated method stub
		
		wqProps = eventContext.getMuleContext().getRegistry().get("wqProps");

		String SAIMON_Product = eventContext.getMessage().getProperty("Path_Prodotto", PropertyScope.INVOCATION);
		String SAIMON_Legenda = eventContext.getMessage().getProperty("Path_Lengenda", PropertyScope.INVOCATION);
		
		return zip(SAIMON_Product, SAIMON_Legenda);
	}
	
	
	
}