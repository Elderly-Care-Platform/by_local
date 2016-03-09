/**
 * 
 */
package com.beautifulyears.cronJob;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

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
			"elder care products", "ear plug", "senior care",
			"senior care in india", "senior care in bangalore",
			"home health care", "old age homes", "dada dadi", "daily help",
			"daily need", "online elder", "obesity", "cancer", "alzheimer",
			"dementia","elder care services in bangalore",
			
			//elder care
			
			"elder care homes in bangalore",
			"advantage elder care in bangalore",
			"elder care in bangalore",
			"elderly care in bangalore",
			"elderly care centers in bangalore",
			"elder care homes bangalore",
			"elderly care home bangalore",
			
			//senior care
			
			"senior care homes bangalore",
			"advantage elder care bangalore review",
			"elder care services bangalore",
			"elderly care services bangalore","senior care homes in bangalore",
			"advantage senior care in bangalore",
			"senior citizen care in bangalore",
			"senior citizen day care in bangalore",
			"senior citizen care homes in bangalore",
			"senior citizen home care services in bangalore",
			"senior care in bangalore",
			"senior care homes bangalore","senior living in bangalore india",
			"senior citizen living in bangalore",
			
			//senior living
			
			"senior living homes in bangalore",
			"senior living facilities in bangalore",
			"senior living projects in bangalore",
			"senior living community in bangalore",
			"senior citizen assisted living in bangalore",
			"senior living near bangalore",
			"elderly living bangalore",
			"senior living in bangalore",
			"senior living homes bangalore",
			"senior living projects bangalore",
			
			//dry body wash
			
			"dry body wash camping",
			"dry body wash sheets",
			"dry body wash boots",
			"dry skin body wash",
			"dry shower body wash",
			"dry skin body wash reviews",
			"homemade dry body wash",
			"ivy dry body wash",
			"dry skin body wash india",
			"dry skin body wash uk",
			"dry body wash",
			"body wash for dry and sensitive skin",
			"body wash for dry acne prone skin",
			"body wash for dry and itchy skin",
			"dry shampoo and body wash",
			"clean and dry body wash",
			"dry skin after body wash",
			"body wash for dry skin available in india",
			"aveeno dry skin body wash",
			"best body wash for dry and sensitive skin",
			"axe body wash dry skin",
			"how to wash a dry body brush",
			"calming dry skin body wash by eucerin",
			"dry skin best body wash",
			"body wash brands for dry skin",
			"best body wash dry itchy skin",
			"body wash for baby dry skin",
			"best body wash dry sensitive skin",
			"how to wash dry body brush",
			"best dry skin body wash in india",
			"can body wash cause dry skin",
			"calming dry skin body wash",
			"old spice body wash causes dry skin",
			"cetaphil dry skin body wash",
			"body wash that doesn't dry skin",
			"does body wash dry out your skin",
			"dove body wash dry skin",
			"diy body wash dry skin",
			"does body wash dry skin",
			"body wash extremely dry skin",
			"calming dry skin body wash eucerin",
			"body wash extra dry skin",
			"best body wash extremely dry skin",
			"eucerin dry skin body wash",
			"best body wash for dry eczema skin",
			"eucerin dry skin body wash reviews",
			"body wash for dry skin",
			"body wash for dry itchy skin",
			"body wash for dry sensitive skin",
			"body wash for dry skin india",
			"body wash for dry itchy sensitive skin",
			"body wash for dry flaky skin",
			"body wash for dry winter skin",
			"body wash for dry skin the best",
			"body wash for dry skin reviews",
			"body wash good for dry skin",
			"germisdin body wash dry skin",
			"homemade body wash dry skin",
			"body wash dry itchy skin",
			"body wash for dry irritated skin",
			"pump it up dry body wash",
			"body wash for very dry itchy skin",
			"homemade body wash for dry itchy skin",
			"best body wash moisturizer for dry skin",
			"best body wash for dry mature skin",
			"body wash for dry skin malaysia",
			"no rinse dry body wash",
			"dry skin natural body wash",
			"sand-off dry body wash",
			"eucerin skin calming dry skin body wash oil",
			"body wash that doesn't dry out skin",
			"does axe body wash dry out skin",
			"body wash products for dry skin",
			"pump it up dry body wash review",
			"body wash recipe for dry skin",
			"body wash for dry rough skin",
			"body wash for really dry skin",
			"homemade body wash recipe for dry skin",
			"old spice dry skin defense body wash review",
			"eucerin skin calming dry skin body wash review",
			"body wash dry sensitive skin",
			"body wash dry skin india",
			"best body wash dry skin",
			"body wash that won't dry skin",
			"men's body wash that doesn't dry skin",
			"body wash very dry skin",
			"body wash winter dry skin",
			"best body wash for dry winter skin",
			"body wash for dry skin with price"
);

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
