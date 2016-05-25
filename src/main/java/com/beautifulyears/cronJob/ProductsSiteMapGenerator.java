/**
 * 
 */
package com.beautifulyears.cronJob;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.Hashtable;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.beautifulyears.util.Util;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.redfin.sitemapgenerator.WebSitemapGenerator;
import com.redfin.sitemapgenerator.WebSitemapUrl;

/**
 * @author Nitin
 *
 */

public class ProductsSiteMapGenerator implements Runnable {
	private String selfUrl = "";
	private String sitemapPath = "";
	private String productServerHost;
	private String productServerPort;
	private static String qrCodeHTML="";

	public ProductsSiteMapGenerator(String selfUrl, String sitemapPath,
			String servicesMenuUrl, String productServerHost,
			String productServerPort) {
		this.selfUrl = selfUrl;
		this.sitemapPath = sitemapPath;
		this.productServerHost = productServerHost;
		this.productServerPort = productServerPort;
		System.out.println(selfUrl + " - " + sitemapPath + " - "
				+ servicesMenuUrl + " - " + productServerHost + " - "
				+ productServerPort);
	}

	@Override
	public void run() {
		File targetDirectory = new File(this.sitemapPath + "/sitemaps/");
		File newProductQRFile = new File(this.sitemapPath + "/product_qr_code.html");
		qrCodeHTML = "<html><head><meta name='robots' content='noindex, follow'></head><body><table "
				+ "style='text-align: center;width: 100%;border: 1px solid;'>";
		try {

			WebSitemapGenerator products_sitemap = WebSitemapGenerator
					.builder(selfUrl, targetDirectory)
					.fileNamePrefix("products_sitemap").build();

			SiteMapGenerator.allUrls.put("PRODUCTS LINKS", null);

			// for adding all the listing pages
			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.add("Accept", "application/json");
			HttpEntity<String> entity = new HttpEntity<String>(headers);

			URI uri = new URI("http", null, productServerHost,
					Integer.parseInt(productServerPort),
					"/beautifulyears/api/v1/catalog/products",
					"page=1&pageSize=180000", null);
			System.out.println("product uri - "+uri);
			ResponseEntity<String> responseEntity = restTemplate.exchange(uri,
					HttpMethod.GET, entity, String.class);
			JSONObject res = new JSONObject(responseEntity.getBody());
			JSONArray products = res.getJSONArray("products");
			for (int i = 0, size = products.length(); i < size; i++) {
				qrCodeHTML += "<tr>";
				qrCodeHTML += "<td  style='border: 1px solid black;'>";
				qrCodeHTML += "<p style='margin: 0;'>"+products.getJSONObject(i).getLong("id")+"</p>";
				qrCodeHTML += "<p style='margin: 0;'>"+products.getJSONObject(i).getString("name")+"</p>";
				qrCodeHTML += "</td>";
				qrCodeHTML += "<td  style='border: 1px solid black;'><img src='";
				addProductPage(products_sitemap, products.getJSONObject(i));
				qrCodeHTML += "'/></td></tr>";
			}
			qrCodeHTML += "</table></body></html>";
			FileUtils.writeStringToFile(newProductQRFile, qrCodeHTML);
			System.out.println("SMG: finished with products qrCodeFile");
			products_sitemap.write();
			System.out.println("SMG: finished with products sitemap file");

		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private WebSitemapGenerator addProductPage(WebSitemapGenerator wsg,
			JSONObject product) throws IOException {
		String productName = product.getString("name");
		int productId = product.getInt("id");
		String slug = Util.getSlug(productName);
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(selfUrl + "/"
				+ slug + "/pd/elder_care_products/" + productId).lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);
		SiteMapGenerator.allUrls.put(slug, wsmUrl.getUrl().toString());
		qrCodeHTML += createQrCode(wsmUrl.getUrl().toString(),slug);
		return wsg;
	}
	
	private String createQrCode(String url,String fileName) throws IOException{
		String myCodeText = url;
        
        // change path as per your laptop/desktop location
        String filePath = "/qrCode/"+fileName+".png";
        int size = 125;
        String fileType = "png";
        File myFile = new File(this.sitemapPath + filePath);
        File parentDir = myFile.getParentFile();
        if(parentDir !=null && ! parentDir.exists() ){
           if(!parentDir.mkdirs()){
               throw new IOException("error creating directories");
           }
        }
        try {
            Hashtable<EncodeHintType, ErrorCorrectionLevel> hintMap = new Hashtable<EncodeHintType, ErrorCorrectionLevel>();
            hintMap.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix byteMatrix = qrCodeWriter.encode(myCodeText,BarcodeFormat.QR_CODE, size, size, hintMap);
            int CrunchifyWidth = byteMatrix.getWidth();
            BufferedImage image = new BufferedImage(CrunchifyWidth, CrunchifyWidth,
                    BufferedImage.TYPE_INT_RGB);
            image.createGraphics();
 
            Graphics2D graphics = (Graphics2D) image.getGraphics();
            graphics.setColor(Color.WHITE);
            graphics.fillRect(0, 0, CrunchifyWidth, CrunchifyWidth);
            graphics.setColor(Color.BLACK);
 
            for (int i = 0; i < CrunchifyWidth; i++) {
                for (int j = 0; j < CrunchifyWidth; j++) {
                    if (byteMatrix.get(i, j)) {
                        graphics.fillRect(i, j, 1, 1);
                    }
                }
            }
            ImageIO.write(image, fileType, myFile);
        } catch (WriterException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return filePath;
	}

}
