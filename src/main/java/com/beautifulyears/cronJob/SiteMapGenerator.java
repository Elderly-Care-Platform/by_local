/**
 * 
 */
package com.beautifulyears.cronJob;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.menu.Menu;
import com.beautifulyears.repository.HousingRepository;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.rest.HousingController;
import com.beautifulyears.rest.MenuController;
import com.beautifulyears.rest.UserProfileController;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.HousingResponse;
import com.beautifulyears.rest.response.UserProfileResponse;
import com.beautifulyears.util.Util;
import com.redfin.sitemapgenerator.WebSitemapGenerator;
import com.redfin.sitemapgenerator.WebSitemapUrl;

/**
 * @author Nitin
 *
 */

@Component
@EnableScheduling
public class SiteMapGenerator {

	private final String filePath = "/opt/tomcat7/webapps/byadmin/";
	private final String communityMenuId = "564071623e60f5b66f62df27";
	private final String selfUrl = "http://dev.beautifulyears.com";
	private final String communityMenuUrl = selfUrl + "/#!/communities/564071623e60f5b66f62df27/all";
	private final int MODULE_ID_DISCUSS = 0;
	private final String communityUrlPrefix = "communities";
	

	private final int MODULE_ID_SERVICES = 1;
	private final String servicesUrlPrefix = "directory";
	private final String servicesMenuUrl = selfUrl+"/#!/directory/56406cd03e60f5b66f62df26/all";
	private final String serviceMenuId = "56406cd03e60f5b66f62df26";
	private final List<String> servicesTags = Arrays.asList("55bc9da5e4b0ac8d31666b48",
			"55bc9de3e4b0ac8d31666b49");

	private final String housingUrlPrefix = "";
	private final String housingMenuUrl = selfUrl+"/#!/senior-living/55bcadaee4b08970a736784c/all";
	private final List<String> housingTags = Arrays.asList(
			"55bc9de3e4b0ac8d31666b49", "55f06f64e4b04c28cae2927d",
			"55f06f74e4b04c28cae2927e", "55f06f85e4b04c28cae2927f",
			"55f06f93e4b04c28cae29280", "55f06fa1e4b04c28cae29281");

	private final String shopMenuUrl = selfUrl+"/#!/shop/55bcad7be4b08970a736784b";
	private static final SimpleDateFormat dateFormat = new SimpleDateFormat(
			"HH:mm:ss");
	private final String productServerHost = "qa.beautifulyears.com";
	private final int productServerPost = 8083;

	private MongoTemplate mongoTemplate;
	private UserProfileRepository userProfileRepository;
	private HousingRepository housingRepository;

	@Autowired
	public SiteMapGenerator(HousingRepository housingRepository,
			MongoTemplate mongoTemplate,
			UserProfileRepository userProfileRepository) {
		this.mongoTemplate = mongoTemplate;
		this.userProfileRepository = userProfileRepository;
		this.housingRepository = housingRepository;

	}

	private static int count = 0;

	@Scheduled(fixedRate = 5000)
	public void reportCurrentTime() throws Exception {
		if (count > 0) {
			return;
		}
		System.out.println("The time is now " + dateFormat.format(new Date()));
		count++;
		File targetDirectory = new File(filePath);
		WebSitemapGenerator wsg = WebSitemapGenerator
				.builder(selfUrl, targetDirectory)
				.fileNamePrefix("sitemap_" + (new Date()).getTime()).build();

		// --------------------for adding all the community detail pages
		List<Discuss> discussList = mongoTemplate.findAll(Discuss.class);
		for (Discuss discuss : discussList) {
			wsg = addDiscussUrl(wsg, discuss);
		}

		// -------------------for adding main community listing page
		MenuController menuController = new MenuController(mongoTemplate);
		@SuppressWarnings("unchecked")
		List<Menu> communityMenuList = (List<Menu>) menuController.getMenu(
				null, communityMenuId);
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(communityMenuUrl)
				.lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);

		// ----------------------for adding all the community listing pages

		for (Menu menu : communityMenuList) {
			wsg = addMenuUrl(wsg, menu, communityUrlPrefix, MODULE_ID_DISCUSS);
		}

		// ----------------------for adding directory listing url

		@SuppressWarnings("unchecked")
		List<Menu> directoryMenuList = (List<Menu>) menuController.getMenu(
				null, serviceMenuId);
		wsmUrl = new WebSitemapUrl.Options(servicesMenuUrl).lastMod(new Date())
				.build();
		wsg.addUrl(wsmUrl);

		// ----------------------for adding all the directory menus
		for (Menu menu : directoryMenuList) {
			wsg = addMenuUrl(wsg, menu, servicesUrlPrefix, MODULE_ID_SERVICES);
		}

		// --------------------- for adding listing page of housing wsmUrl =
		new WebSitemapUrl.Options(housingMenuUrl).lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);

		// ------------------------for all professional and institution profiles
		UserProfileController profileCtrl = new UserProfileController(
				userProfileRepository, mongoTemplate);

		@SuppressWarnings("unchecked")
		ResponseEntity<BYGenericResponseHandler.ByGenericResponse> profileResponse = (ResponseEntity<BYGenericResponseHandler.ByGenericResponse>) profileCtrl
				.getUserProfilebyCity(null, servicesTags, 0, 3000, null,
						"lastModifiedAt", 0, null, null);

		for (UserProfileResponse.UserProfileEntity profile : ((UserProfileResponse.UserProfilePage) profileResponse
				.getBody().getData()).getContent()) {
			addDirectoryUrl(wsg, profile);
		}

		// ----------------------for housing profile pages
		HousingController housingCtrl = new HousingController(
				housingRepository, mongoTemplate);

		@SuppressWarnings("unchecked")
		ResponseEntity<BYGenericResponseHandler.ByGenericResponse> housingResponse = (ResponseEntity<BYGenericResponseHandler.ByGenericResponse>) housingCtrl
				.getPage(null, null, null, "lastModifiedAt", 0, 0, 3000, null,
						housingTags, null);
		for (HousingResponse.HousingEntity housing : ((HousingResponse.HousingPage) housingResponse
				.getBody().getData()).getContent()) {
			addHousingUrl(wsg, housing);
		}

		// -------------------for adding main product listing page wsmUrl =
		new WebSitemapUrl.Options(shopMenuUrl).lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);

		// for adding all the listing pages
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.add("Accept", "application/json");
		HttpEntity<String> entity = new HttpEntity<String>(headers);
		URI uri = new URI("http", null, productServerHost, productServerPost,
				"/beautifulyears/api/v1/catalog/categories", "limit=100000",
				null);
		ResponseEntity<String> responseEntity = restTemplate.exchange(uri,
				HttpMethod.GET, entity, String.class);
		JSONObject json = new JSONObject(responseEntity.getBody());
		JSONArray categories = json.getJSONArray("category");
		addProductCategory(wsg, categories);

		uri = new URI("http", null, productServerHost, productServerPost,
				"/beautifulyears/api/v1/catalog/products",
				"page=1&pageSize=180000", null);
		responseEntity = restTemplate.exchange(uri, HttpMethod.GET, entity,
				String.class);
		JSONArray products = new JSONArray(responseEntity.getBody());
		for (int i = 0, size = products.length(); i < size; i++) {
			addProductPage(wsg, products.getJSONObject(i));
		}

		wsg.write();
	}

	private WebSitemapGenerator addProductPage(WebSitemapGenerator wsg,
			JSONObject product) throws MalformedURLException {
		String productName = product.getString("name");
		int productId = product.getInt("id");
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(
				selfUrl + "/#!/" + getSlug(productName)
						+ "/pd/" + productId).lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);
		return wsg;
	}

	private WebSitemapGenerator addProductCategory(WebSitemapGenerator wsg,
			JSONArray categories) throws MalformedURLException {
		for (int i = 0, size = categories.length(); i < size; i++) {
			JSONObject category = categories.getJSONObject(i);
			System.out.println(category);
			String categoryName = category.getString("name");
			int categoryId = category.getInt("id");
			WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(
					selfUrl + "/#!/shop/"
							+ getSlug(categoryName) + "/" + categoryId)
					.lastMod(new Date()).build();
			wsg.addUrl(wsmUrl);

			if (category.has("subcategories")) {
				JSONArray subcategories = category
						.getJSONArray("subcategories");
				addProductCategory(wsg, subcategories);
			}
		}
		return wsg;
	}

	private WebSitemapGenerator addMenuUrl(WebSitemapGenerator wsg, Menu menu,
			String parentMenuName, int moduleId) throws MalformedURLException {
		if (!menu.isHidden() && menu.getModule() == moduleId) {
			WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(
					selfUrl+"/#!/" + parentMenuName + "/"
							+ getSlug(menu.getDisplayMenuName()) + "/"
							+ menu.getId() + "/all").lastMod(new Date())
					.build();
			wsg.addUrl(wsmUrl);
		}
		if (menu.getChildren().size() > 0) {
			for (Menu childMenu : menu.getChildren()) {
				wsg = addMenuUrl(wsg, childMenu, parentMenuName, moduleId);
			}
		}
		return wsg;
	}

	private WebSitemapGenerator addDiscussUrl(WebSitemapGenerator wsg,
			Discuss discuss) throws MalformedURLException {
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(
				selfUrl+"/#!/communities/"
						+ getDiscussSlug(discuss) + "/?id=" + discuss.getId())
				.lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);
		return wsg;
	}

	private WebSitemapGenerator addDirectoryUrl(WebSitemapGenerator wsg,
			UserProfileResponse.UserProfileEntity profile)
			throws MalformedURLException {
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(
				selfUrl+"/#!/users/"
						+ getUserSlug(profile) + "/?profileId="
						+ profile.getUserId()).lastMod(new Date()).build();
		wsg.addUrl(wsmUrl);
		return wsg;
	}

	private WebSitemapGenerator addHousingUrl(WebSitemapGenerator wsg,
			HousingResponse.HousingEntity housing) throws MalformedURLException {
		WebSitemapUrl wsmUrl = new WebSitemapUrl.Options(
				selfUrl+"/#!/users/"
						+ getHousingSlug(housing) + "/?profileId="
						+ housing.getUserId()).lastMod(new Date()).build();
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
		return getSlug(proTitle);
	}

	private String getUserSlug(UserProfileResponse.UserProfileEntity profile) {
		String proTitle = "others";
		if (null != profile && null != profile.getBasicProfileInfo()
				&& !Util.isEmpty(profile.getBasicProfileInfo().getFirstName())) {
			proTitle = profile.getBasicProfileInfo().getFirstName();
			if (null != profile.getBasicProfileInfo()
					&& !Util.isEmpty(profile.getIndividualInfo().getLastName())) {
				proTitle = proTitle + " "
						+ profile.getIndividualInfo().getLastName();
			}
		} else {
			proTitle = "others";
		}
		return getSlug(proTitle);
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
		return getSlug(disTitle);
	}

	private String getSlug(String name) {
		if (null != name) {
			org.jsoup.nodes.Document doc = Jsoup.parse(name);
			String slug = doc.text();
			int nextSpaceIndex = slug.indexOf(" ", 100);
			if (nextSpaceIndex > 1) {
				slug = slug.substring(0, nextSpaceIndex);
			}

			slug = removeSpecialChars(slug);
			return slug;
		}
		return name;
	}

	private String removeSpecialChars(String name) {
		String modifiedName = name;
		if (null != name) {
			modifiedName = name.replaceAll("[^a-zA-Z0-9 ]", "");
			modifiedName = modifiedName.replaceAll("\\s+", "-").toLowerCase();
		}
		return modifiedName;
	}
}
