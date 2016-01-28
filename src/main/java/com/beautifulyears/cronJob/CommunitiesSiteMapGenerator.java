/**
 * 
 */
package com.beautifulyears.cronJob;

import java.io.File;
import java.net.MalformedURLException;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;

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

			List<Discuss> discussList = mongoTemplate.findAll(Discuss.class);
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
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(selfUrl
				+ "/#!/communities/" + getDiscussSlug(discuss) + "/?id="
				+ discuss.getId()).lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);
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
