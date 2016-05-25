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
			"body wash for dry skin with price",
			
			//water mattress
			
			"water mattress price",
			"water mattress online",
			"water mattress india",
			"water mattress online india",
			"water mattress benefits",
			"water mattress prank",
			"water mattress topper",
			"water mattress price in pakistan",
			"water mattress with fish",
			"water mattress reviews",
			"water mattress amazon",
			"water mattress australia",
			"water mattress available in sri lanka",
			"water mattress argos",
			"water air mattress",
			"water absorbent mattress pads",
			"water air mattress walmart",
			"water mattress south africa",
			"water mattress pros and cons",
			"water mattress north and south",
			"buy a water mattress",
			"how to make a water mattress",
			"how much does a water mattress cost",
			"cleaning a water damaged mattress",
			"how to fill a water mattress",
			"how to drain a water mattress",
			"water mattress bed",
			"water mattress buy",
			"water mattress bladder",
			"water mattress buy online",
			"water mattress for bedsores",
			"water mattress brands",
			"waterbed mattress price",
			"water breaking mattress protector",
			"waterbed mattress pad",
			"water mattress canadian tire",
			"water mattress canada",
			"water mattress cover",
			"water mattress cost",
			"water mattress china",
			"water mattress conditioner",
			"water mattress cheap",
			"water mattress cows",
			"water mattress clean",
			"water cooled mattress pad",
			"water mattress dubai",
			"water mattress draining kit",
			"water mattress delhi",
			"water mattress definition",
			"water mattress diy",
			"water mattress description",
			"water damaged mattress",
			"water damaged mattress cleaning",
			"mattress water damage mold",
			"water mattress for dogs",
			"water mattress ebay",
			"water-mattress-emptying electric pump",
			"water mattress in egypt",
			"hot water extraction mattress cleaning",
			"hot water extraction mattress",
			"waterbed mattress for sale",
			"water mattress for baby",
			"water mattress for crib",
			"waterbed mattress full size",
			"waterbed mattress frame",
			"waterbed mattress fill & drain kit",
			"water mattress for lake",
			"water mattress for sale in sri lanka",
			"water mattress for back pain",
			"water mattress germany",
			"water mattress good",
			"water gel mattress",
			"water gel mattress pad",
			"giant water mattress",
			"water mattress heater",
			"water mattress hyderabad",
			"water mattress health",
			"water heated mattress pad",
			"water heated mattress",
			"water mattress for hospital bed",
			"water resistant heated mattress pad",
			"half water half mattress bed",
			"hot water heating mattress pad",
			"hot water heating mattress",
			"water mattress in sri lanka",
			"water mattress ireland",
			"water mattress in pakistan",
			"water mattress india price",
			"water mattress inc",
			"water mattress in dubai",
			"water mattress in mumbai",
			"water mattress in delhi",
			"water mattress in bangalore",
			"water mattress joke",
			"water mattress jump",
			"jual water mattress",
			"water mattress uk",
			"water mattress king",
			"water mattress repair kit",
			"water mattress price in kolkata",
			"kanmed water mattress",
			"kuss water mattress",
			"waterproof mattress cover king",
			"korean water mattress",
			"cheap water mattress uk",
			"water mattress lebanon",
			"water mattress london",
			"water latex mattress",
			"water latex mattress review",
			"water lily mattress",
			"water latex mattress uk",
			"waterlattex mattress",
			"water mattress sri lanka",
			"waterbed mattress water level",
			"water mattress malaysia",
			"water mattress manufacturers",
			"water mattress medical",
			"water mattress manufacturers china",
			"water mattress material",
			"water mattress montreal",
			"water mattress maintenance",
			"water massage mattress",
			"water marks mattress",
			"neonatal water mattress",
			"water mattress overlay",
			"water on mattress",
			"water overlay mattress pads",
			"water filled mattress overlay",
			"buy water mattress online india",
			"buy water mattress online",
			"spilled water on mattress",
			"water stain on mattress",
			"water mattress price in india",
			"water mattress pad",
			"water mattress price in sri lanka",
			"water mattress price malaysia",
			"water mattress protector",
			"water mattress pakistan",
			"water mattress pad singapore",
			"water mattress queen",
			"water resistant mattress pads queen",
			"waterproof mattress cover queen",
			"water resistant mattress protector",
			"water resistant mattress cover",
			"water resistant mattress pad",
			"water resistant mattress",
			"water repellent mattress cover",
			"water resistant mattress protector malaysia",
			"water repellent mattress",
			"water mattress singapore",
			"water mattress sale sri lanka",
			"water mattress single",
			"water mattress store",
			"water mattress suppliers",
			"water mattress sizes",
			"water mattress sale",
			"water mattress sydney",
			"water mattress tubes",
			"water mattress twin",
			"water top mattress",
			"mattress water test",
			"water filled mattress topper",
			"water cooled mattress topper",
			"water floatation mattress toppers",
			"waterbed mattress topper",
			"water mattress uses",
			"water under mattress",
			"water mattress in uae",
			"buy water mattress uk",
			"water mattress for sale uk",
			"us water mattress",
			"us water mattress softside",
			"water mattress video",
			"water mattress vs. air mattress",
			"water mattress vs memory foam",
			"funny water mattress video",
			"vodka water mattress",
			"victorian water mattress",
			"water mattress wiki",
			"water mattress walmart",
			"water mattress weight",
			"water wave mattress",
			"walmart waterbed mattress",
			"waterbed mattress water storage",
			"mattress with water tubes",
			"water mattress youtube",
			"cylinder water mattress model 35",
			
			//cervical pillow
			
			"cervical pillow",
			"cervical pillow india",
			"cervical pillow flipkart",
			"cervical pillow images",
			"cervical pillow memory foam",
			"cervical pillow sleepwell",
			"cervical pillows for neck pain india",
			"cervical pillow amazon",
			"cervical pillow deluxe",
			"cervical pillow buy online",
			"cervical pillow reviews",
			"cervical pillow tynor",
			"cervical pillow amazon india",
			"cervical pillow australia",
			"cervical pillow argos",
			"cervical pillow at target",
			"cervical pillow and sleep apnea",
			"cervical pillow at bed bath and beyond",
			"cervical pillow at walmart",
			"cervical pillow after surgery",
			"cervical pillow as seen on the doctors",
			"a cervical pillow",
			"cervical pillow benefits",
			"cervical pillow buy online india",
			"cervical pillow by viaggi",
			"cervical pillow bangalore",
			"cervical pillow best",
			"cervical pillow bed bath beyond",
			"cervical pillow bangladesh",
			"cervical pillow back sleepers",
			"cervical pillow brookstone",
			"cervical pillow cost",
			"cervical pillow chennai",
			"cervical pillow covers",
			"cervical pillow costco",
			"cervical pillow canada",
			"cervical pillow cpt code",
			"cervical pillow cvs",
			"cervical pillow cpt",
			"cervical pillow comparison",
			"cervical pillow case",
			"cervical pillow diy",
			"cervical pillow dubai",
			"cervical pillow dunelm",
			"cervical pillow delhi",
			"cervical pillow definition",
			"cervical pillow dme code",
			"cervical pillow dublin",
			"cervical pillow d core",
			"cervical pillow down",
			"do cervical pillows help",
			"do cervical pillows work",
			"d cervical pillow",
			"what do cervical pillows look like",
			"do cervical neck pillows work",
			"cervical pillows do they work",
			"do cervical traction pillows work",
			"cervical pillow ebay",
			"cervical pillow edmonton",
			"cervical pillow evidence",
			"cervical pillow ebay india",
			"cervical pillow ebay uk",
			"cervical ease pillow",
			"ergonomic cervical pillow",
			"cervical traction neck pillow ebay",
			"extra firm cervical pillow",
			"cervical ease traction pillow",
			"cervical pillow for neck pain india",
			"cervical pillow for sale",
			"cervical pillow for neck pain reviews",
			"cervical pillow for neck pain",
			"cervical pillow for side sleepers",
			"cervical pillow flamingo",
			"cervical pillow for driving",
			"cervical pillow for sleep apnea",
			"cervical pillow for tmj",
			"cervical pillow good or bad",
			"cervical gel pillow",
			"tri core cervical pillow gentle",
			"good cervical pillow",
			"elasto-gel cervical pillow",
			"ganga ayurvedic cervical pillow",
			"guardian cervical pillow",
			"cervical pillow how to use",
			"cervical pillow hcpcs",
			"cervical pillow hcpcs code",
			"cervical pillow hurts",
			"cervical pillow harga",
			"cervical pillow herniated disc",
			"cervical pillow hyderabad",
			"cervical pillow healthkart",
			"cervical pillow hurts my neck",
			"cervical pillow harvey norman",
			"cervical pillow india sleepwell",
			"cervical pillow in bangalore",
			"cervical pillow ireland",
			"cervical pillow ikea",
			"cervical pillow in pakistan",
			"cervical pillow india flipkart",
			"cervical pillow in sri lanka",
			"cervical pillow in thane",
			"cervical pillow jaco",
			"cervical pillow jaco harga",
			"cervical pillow john lewis",
			"cervical pillow jcpenney",
			"cervical pillow jakarta",
			"cervical pillow jual",
			"jackson cervical pillow",
			"jackson cervical pillow cases",
			"jsb cervical pillow",
			"ruth jackson cervical pillow",
			"cervical pillow uk",
			"cervical pillow kohl's",
			"cervical pillow kmart",
			"cervical pillow king",
			"cervical pillow king size",
			"cervical pillow kaskus",
			"cervical kyphosis pillow",
			"tri-core cervical pillow uk",
			"best cervical pillow uk",
			"cervical neck pillow uk",
			"cervical pillow lazada",
			"cervical pillow latex",
			"cervical pillow ludhiana",
			"cervical pillow london",
			"cervical pillow lowest price",
			"cervical pillow letter of medical necessity",
			"cervical lordosis pillow",
			"cervical linear pillow",
			"cervical lumbar pillows",
			"cervical pillow mumbai",
			"cervical pillow melbourne",
			"cervical pillow malaysia",
			"cervical pillow manufacturers india",
			"cervical pillow macy",
			"cervical pillow medical necessity",
			"cervical pillow montreal",
			"cervical pillow meaning",
			"cervical pillow migraine",
			"cervical pillow neck pain",
			"cervical pillow nz",
			"cervical pillow neck",
			"cervical neck pillow reviews",
			"cervical neck pillow bed bath and beyond",
			"cervical neck pillow for side sleepers",
			"cervical neck pillow walmart",
			"cervical neck pillow target",
			"cervical neck pillow online",
			"cervical pillow online",
			"cervical pillow online purchase",
			"cervical pillow or contour pillow",
			"cervical pillow online shopping",
			"cervical pillow olx",
			"cervical pillow ottawa",
			"cervical pillow on snapdeal",
			"cervical pillow on the doctors",
			"cervical pillow on homeshop18",
			"cervical pillow online order",
			"wal-pil-o cervical pillow",
			"cervical pillow price",
			"cervical pillow paytm",
			"cervical pillow position",
			"cervical pillow price in india",
			"cervical pillow perth",
			"cervical pillow petite",
			"cervical pillow philippines",
			"cervical pillow purpose",
			"cervical pillow pregnancy",
			"cervical pillow pattern",
			"cervical pillow in qatar",
			"high quality cervical pillow",
			"cervical pillow roll",
			"cervical pillow ratings",
			"cervical pillow reviews uk",
			"cervical pillow rite aid",
			"cervical pillow regular",
			"cervical pillow round",
			"cervical pillow research",
			"cervical pillow relax the back",
			"cervical pillow recommendations",
			"cervical pillows",
			"cervical pillows or orthopedic pillows",
			"cervical pillows for neck pain",
			"cervical pillows for side sleepers",
			"cervical pillows for neck pain reviews",
			"cervical pillows amazon",
			"cervical pillows walmart",
			"cervical pillows reviews",
			"cervical pillows canada",
			"cervical pillow tmj",
			"cervical pillow toronto",
			"cervical pillow tempur pedic",
			"cervical pillow target",
			"cervical pillow therapeutica",
			"cervical pillow travel size",
			"cervical pillow types",
			"cervical pillow travel",
			"cervical pillow traction",
			"atlas-t cervical pillow",
			"cervical pillow uses",
			"cervical pillow usage",
			"cervical pillow usa",
			"cervical pillow uae",
			"flamingo cervical pillow - universal",
			"tynor cervical pillow - universal (regular)",
			"ultima 2000 cervical pillow",
			"cervical pillow viaggi",
			"cervical pillow vancouver",
			"cervical pillow vissco",
			"cervical pillow video",
			"cervical vertebrae pillow",
			"cervical vertigo pillow",
			"cervical vertebral pillow",
			"cervical v pillow",
			"ab contour cervical pillow vinyl",
			"vedic-trac cervical pillow",
			"cervical pillow youtube",
			"3 zone cervical pillow",
			"tri-core cervical pillow comfort zone",
			"cervical pillow pill 01",
			"ultima 1 cervical pillow",
			"4 in 1 cervical pillow",
			"ultima 2000 cervical pillow medium",
			"ultima 2000 cervical pillow reviews",
			"ultima 2000 cervical pillow small",
			"3 inch cervical pillow",
			"3-zone cervical comfort pillow",
			"66fit cervical pillow",
			"66fit cervical pillow reviews",
			"66ft cervical pillow",
			"cervical pillow walmart",
			"cervical pillow bed bath and beyond",
			"top 10 cervical pillows"
			
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
		searchTerm = escapeXml(searchTerm);
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(selfUrl
				+ "/search/" + searchTerm + "/All").lastMod(new Date())
				.build();
		wsg.addUrl(wsmUrl);
		SiteMapGenerator.allUrls.put(searchTerm, wsmUrl.getUrl().toString());
		return wsg;
	}
	
	private String escapeXml(String s) {
	    return s.replaceAll("&", "&amp;").replaceAll(">", "&gt;").replaceAll("<", "&lt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
	}

}
