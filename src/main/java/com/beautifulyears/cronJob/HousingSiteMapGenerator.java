/**
 * 
 */
package com.beautifulyears.cronJob;

import java.io.File;
import java.net.MalformedURLException;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;

import com.beautifulyears.repository.HousingRepository;
import com.beautifulyears.rest.HousingController;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.HousingResponse;
import com.beautifulyears.util.Util;
import com.redfin.sitemapgenerator.WebSitemapGenerator;
import com.redfin.sitemapgenerator.WebSitemapUrl;

/**
 * @author Nitin
 *
 */

public class HousingSiteMapGenerator implements Runnable {
	private String selfUrl = "";
	private String sitemapPath = "";
	private MongoTemplate mongoTemplate;
	private HousingRepository housingRepository;
	private List<String> housingTags;

	public HousingSiteMapGenerator(String selfUrl, String sitemapPath,
			MongoTemplate mongoTemplate, List<String> housingTags,
			HousingRepository housingRepository) {
		this.selfUrl = selfUrl;
		this.sitemapPath = sitemapPath;
		this.mongoTemplate = mongoTemplate;
		this.housingTags = housingTags;
		this.housingRepository = housingRepository;
	}

	@Override
	public void run() {
		File targetDirectory = new File(this.sitemapPath + "/sitemaps/");
		try {
			WebSitemapGenerator housing_sitemap = WebSitemapGenerator
					.builder(selfUrl, targetDirectory)
					.fileNamePrefix("housing_sitemap").build();

			// ----------------------for housing profile pages
			HousingController housingCtrl = new HousingController(
					housingRepository, mongoTemplate);

			@SuppressWarnings("unchecked")
			ResponseEntity<BYGenericResponseHandler.ByGenericResponse> housingResponse = (ResponseEntity<BYGenericResponseHandler.ByGenericResponse>) housingCtrl
					.getPage(null, null, null, "lastModifiedAt", 0, 0, 3000,
							null, housingTags, null);
			for (HousingResponse.HousingEntity housing : ((HousingResponse.HousingPage) housingResponse
					.getBody().getData()).getContent()) {
				addHousingUrl(housing_sitemap, housing);
			}
			
			housing_sitemap.write();
			System.out.println("SMG: finished with housings sitemap file");

		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	private WebSitemapGenerator addHousingUrl(WebSitemapGenerator wsg,
			HousingResponse.HousingEntity housing) throws MalformedURLException {
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(selfUrl + "/#!/users/"
				+ getHousingSlug(housing) + "/?profileId="
				+ housing.getUserId() + "&branchId=" + housing.getId())
				.lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);
		return wsg;
	}

	private String getHousingSlug(HousingResponse.HousingEntity housing) {
		String proTitle = "others";
		if (null != housing && !Util.isEmpty(housing.getName())) {
			proTitle = housing.getName();
		} else {
			proTitle = "others";
		}
		return Util.getSlug(proTitle);
	}

}
