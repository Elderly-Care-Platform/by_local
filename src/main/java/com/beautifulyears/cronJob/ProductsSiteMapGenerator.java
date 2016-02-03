/**
 * 
 */
package com.beautifulyears.cronJob;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.beautifulyears.util.Util;
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

	public ProductsSiteMapGenerator(String selfUrl, String sitemapPath,
			String servicesMenuUrl, String productServerHost,
			String productServerPort) {
		this.selfUrl = selfUrl;
		this.sitemapPath = sitemapPath;
		this.productServerHost = productServerHost;
		this.productServerPort = productServerPort;
	}

	@Override
	public void run() {
		File targetDirectory = new File(this.sitemapPath + "/sitemaps/");
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
			ResponseEntity<String> responseEntity = restTemplate.exchange(uri,
					HttpMethod.GET, entity, String.class);
			JSONArray products = new JSONArray(responseEntity.getBody());
			for (int i = 0, size = products.length(); i < size; i++) {
				addProductPage(products_sitemap, products.getJSONObject(i));
			}

			products_sitemap.write();
			System.out.println("SMG: finished with products sitemap file");

		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private WebSitemapGenerator addProductPage(WebSitemapGenerator wsg,
			JSONObject product) throws MalformedURLException {
		String productName = product.getString("name");
		int productId = product.getInt("id");
		String slug = Util.getSlug(productName);
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(selfUrl + "/#!/"
				+ slug + "/pd/" + productId).lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);
		SiteMapGenerator.allUrls.put(slug, wsmUrl.getUrl().toString());
		return wsg;
	}

}
