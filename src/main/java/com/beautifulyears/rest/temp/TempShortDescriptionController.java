package com.beautifulyears.rest.temp;

import java.io.File;
import java.lang.reflect.Field;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.amazonaws.services.datapipeline.model.Query;
import com.beautifulyears.constants.CDNConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.BasicProfileInfo;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.util.Util;
//import com.beautifulyears.domain.UserProfile;
import com.mongodb.DBCollection;

@Controller
@RequestMapping("/addShortDesc")
public class TempShortDescriptionController {

	private MongoTemplate mongoTemplate;
	private String bucketName;

	@Autowired
	public TempShortDescriptionController(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = RequestMethod.GET, value = "", produces = MediaType.APPLICATION_JSON_VALUE)
	public @ResponseBody Object changePassword(HttpServletRequest req,
			HttpServletResponse res) throws Exception {
		bucketName = System.getProperty("s3MediaBucketName");

		List<UserProfile> userProfiles = mongoTemplate
				.findAll(UserProfile.class);
		List<Discuss> discuss = mongoTemplate.findAll(Discuss.class);
		List<HousingFacility> housingFacility = mongoTemplate
				.findAll(HousingFacility.class);
		for (Iterator iterator = userProfiles.iterator(); iterator.hasNext();) {
			UserProfile userProfile = (UserProfile) iterator.next();
			if (null != userProfile
					&& null != userProfile.getBasicProfileInfo()
					&& null != userProfile.getBasicProfileInfo()
							.getPhotoGalleryURLs()) {
				List<Map<String, String>> photos = userProfile
						.getBasicProfileInfo().getPhotoGalleryURLs();

				for (int i = 0; i < photos.size(); i++) {
					Map<String, String> array_element = photos.get(i);
					photos.set(i, checkImageMap(array_element));
				}

			}

			if (null != userProfile
					&& null != userProfile.getBasicProfileInfo()
					&& null != userProfile.getBasicProfileInfo()
							.getDescription()) {
				userProfile.getBasicProfileInfo().setDescription(
						changeText(userProfile.getBasicProfileInfo()
								.getDescription()));
			}

			if (null != userProfile
					&& null != userProfile.getBasicProfileInfo()
					&& null != userProfile.getBasicProfileInfo()
							.getProfileImage()) {
				userProfile.getBasicProfileInfo().setProfileImage(
						checkImageMap(userProfile.getBasicProfileInfo()
								.getProfileImage()));
			}
			mongoTemplate.save(userProfile);
		}

		for (Iterator iterator = discuss.iterator(); iterator.hasNext();) {
			Discuss singleDiscuss = (Discuss) iterator.next();
			if (null != singleDiscuss
					&& null != singleDiscuss.getArticlePhotoFilename()) {
				singleDiscuss
						.setArticlePhotoFilename(checkImageMap(singleDiscuss
								.getArticlePhotoFilename()));
			}
			if ("Cancer is no more a deadly disease.".equals(singleDiscuss
					.getTitle())) {
				System.out.println("found");
			}

			singleDiscuss.setText(changeText(singleDiscuss.getText()));
			mongoTemplate.save(singleDiscuss);
		}

		for (Iterator iterator = housingFacility.iterator(); iterator.hasNext();) {
			HousingFacility singleHousing = (HousingFacility) iterator.next();
			if (null != singleHousing
					&& null != singleHousing.getPhotoGalleryURLs()) {

				List<Map<String, String>> photos = singleHousing
						.getPhotoGalleryURLs();

				for (int i = 0; i < photos.size(); i++) {
					Map<String, String> array_element = photos.get(i);
					photos.set(i, checkImageMap(array_element));
				}

			}

			if (null != singleHousing
					&& null != singleHousing.getProfileImage()) {
				singleHousing.setProfileImage(checkImageMap(singleHousing
						.getProfileImage()));
			}

			if (null != singleHousing && null != singleHousing.getDescription()) {
				singleHousing.setDescription(changeText(singleHousing
						.getDescription()));
			}

			mongoTemplate.save(singleHousing);
		}

		return null;
	}

	private Map<String, String> checkImageMap(Map<String, String> imageMap) {
		if (!Util.isEmpty(imageMap.get("original"))
				&& imageMap.get("original").contains("/uploaded_files/")) {
			String str = imageMap.get("original");
			str = str.replace("/uploaded_files/", CDNConstants.S3_HOST
					+ bucketName + "/" + CDNConstants.IMAGE_CDN_ORIG_FOLDER
					+ "/");
			// System.out.println(imageMap.get("original"));
			// System.out.println(str);
			imageMap.put("original", str);
		}
		if (!Util.isEmpty(imageMap.get("titleImage"))
				&& imageMap.get("titleImage").contains("/uploaded_files/")) {
			String str = imageMap.get("titleImage");
			str = str.replace("/uploaded_files/", CDNConstants.S3_HOST
					+ bucketName + "/" + CDNConstants.IMAGE_CDN_TITLE_FOLDER
					+ "/");
			// str = str.replace("_640_650","");
			// System.out.println(imageMap.get("titleImage"));
			// System.out.println(str);
			imageMap.put("titleImage", str);
		}
		if (!Util.isEmpty(imageMap.get("thumbnailImage"))
				&& imageMap.get("thumbnailImage").contains("/uploaded_files/")) {
			String str = imageMap.get("thumbnailImage");
			str = str.replace("/uploaded_files/", CDNConstants.S3_HOST
					+ bucketName + "/" + CDNConstants.IMAGE_CDN_THUMB_FOLDER
					+ "/");
			// str = str.replace("_135_168","");
			// System.out.println(imageMap.get("thumbnailImage"));
			// System.out.println(str);
			imageMap.put("thumbnailImage", str);
		}
		return imageMap;

	}

	private String changeText(String text) {

		if (!Util.isEmpty(text)) {
			if (text.matches("(?is).*/uploaded_files/.*")) {
				text = text.replaceAll("/uploaded_files/", CDNConstants.S3_HOST
						+ bucketName + "/" + CDNConstants.IMAGE_CDN_ORIG_FOLDER
						+ "/");
				System.out.println(text);
			}
			if (text.matches("(?is).*uploaded_files/.*")) {
				text = text.replaceAll("uploaded_files/", CDNConstants.S3_HOST
						+ bucketName + "/" + CDNConstants.IMAGE_CDN_ORIG_FOLDER
						+ "/");
				System.out.println(text);
			}
		}
		return text;
	}
}