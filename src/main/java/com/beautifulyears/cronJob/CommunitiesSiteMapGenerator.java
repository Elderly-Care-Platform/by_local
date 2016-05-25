/**
 * 
 */
package com.beautifulyears.cronJob;

import java.io.File;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.util.Util;
import com.redfin.sitemapgenerator.WebSitemapGenerator;
import com.redfin.sitemapgenerator.WebSitemapUrl;

/**
 * @author Nitin
 *
 */

public class CommunitiesSiteMapGenerator implements Runnable {
	private String selfUrl = "";
	private String sitemapPath = "";
	private MongoTemplate mongoTemplate;

	public CommunitiesSiteMapGenerator(String selfUrl, String sitemapPath,
			MongoTemplate mongoTemplate) {
		this.selfUrl = selfUrl;
		this.sitemapPath = sitemapPath;
		this.mongoTemplate = mongoTemplate;
	}

	@Override
	public void run() {
		File targetDirectory = new File(this.sitemapPath + "/sitemaps/");
		try {
			WebSitemapGenerator community_sitemap = WebSitemapGenerator
					.builder(selfUrl, targetDirectory)
					.fileNamePrefix("community_sitemap").build();
			
			Query q = new Query();
			List<String> discussTypeArray = new ArrayList<String>();
			discussTypeArray.add("Q");
			discussTypeArray.add("P");
			q.addCriteria(Criteria.where((String) "discussType").in(
					discussTypeArray));
			q.addCriteria(Criteria.where("status").is(
					DiscussConstants.DISCUSS_STATUS_ACTIVE));

			List<Discuss> discussList = mongoTemplate.find(q,Discuss.class);
			SiteMapGenerator.allUrls.put("DISCUSS LINKS", null);
			for (Discuss discuss : discussList) {
				community_sitemap = addDiscussUrl(community_sitemap, discuss);
			}

			community_sitemap.write();
			System.out.println("SMG: finished with community sitemap file");

		} catch (MalformedURLException e) {
			e.printStackTrace();
		}

	}

	private WebSitemapGenerator addDiscussUrl(WebSitemapGenerator wsg,
			Discuss discuss) throws MalformedURLException {
		String slug = getDiscussSlug(discuss);
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(selfUrl
				+ "/elder-care-forums/" + slug + "/?id="
				+ discuss.getId()).lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);
		SiteMapGenerator.allUrls.put(slug, wsmUrl.getUrl().toString());
		return wsg;
	}

	private String getDiscussSlug(Discuss discuss) {
		String disTitle = "others";
		if (null != discuss.getTitle()
				&& discuss.getTitle().trim().length() > 0) {
			disTitle = discuss.getTitle();
		} else if (null != discuss.getText()
				&& discuss.getText().trim().length() > 0) {
			disTitle = discuss.getText();
		} else if (null != discuss.getLinkInfo()
				&& null != discuss.getLinkInfo().getTitle()
				&& discuss.getLinkInfo().getTitle().length() > 0) {
			disTitle = discuss.getLinkInfo().getTitle();
		} else {
			disTitle = "others";
		}
		return Util.getSlug(disTitle);
	}

}
