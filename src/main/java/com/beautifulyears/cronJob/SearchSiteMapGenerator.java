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
import java.util.Arrays;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;

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

public class SearchSiteMapGenerator implements Runnable {
	private String selfUrl = "";
	private String sitemapPath = "";
	private final List<String> searchTerms = Arrays.asList("elder care",
			"senior care", "elder care in india", "senior care in india",
			"elder care products");

	public SearchSiteMapGenerator(String selfUrl, String sitemapPath) {
		this.selfUrl = selfUrl;
		this.sitemapPath = sitemapPath;
		System.out.println(selfUrl + " - " + sitemapPath);
	}

	@Override
	public void run() {
		File targetDirectory = new File(this.sitemapPath + "/sitemaps/");
		try {

			WebSitemapGenerator search_sitemap = WebSitemapGenerator
					.builder(selfUrl, targetDirectory)
					.fileNamePrefix("search_sitemap").build();

			SiteMapGenerator.allUrls.put("SEARCH LINKS", null);

			// for adding all the listing pages

			for (int i = 0, size = searchTerms.size(); i < size; i++) {
				addSearchPage(search_sitemap, searchTerms.get(i));
			}
			search_sitemap.write();
			System.out.println("SMG: finished with search sitemap file");

		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private WebSitemapGenerator addSearchPage(WebSitemapGenerator wsg,
			String searchTerm) throws IOException {
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(selfUrl
				+ "/#!/search/" + searchTerm + "/All").lastMod(new Date())
				.build();
		wsg.addUrl(wsmUrl);
		SiteMapGenerator.allUrls.put(searchTerm, wsmUrl.getUrl().toString());
		return wsg;
	}

}
