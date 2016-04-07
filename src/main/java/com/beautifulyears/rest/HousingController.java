/**
 * 
 */
package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.HousingRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.HousingResponse;
import com.beautifulyears.rest.response.PageImpl;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.HousingLogHandler;

/**
 * @author Nitin
 *
 */

@Controller
@RequestMapping("/housing")
public class HousingController {
	private static HousingRepository staticHousingRepository;
	public static MongoTemplate staticMongoTemplate;
	private static ActivityLogHandler<HousingFacility> logHandler;

	// private static final Logger logger =
	// Logger.getLogger(HousingController.class);

	@Autowired
	public HousingController(HousingRepository housingRepository,
			MongoTemplate mongoTemplate) {
		staticHousingRepository = housingRepository;
		staticMongoTemplate = mongoTemplate;
		logHandler = new HousingLogHandler(mongoTemplate);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/page" }, produces = { "application/json" })
	@ResponseBody
	public Object getPage(
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam(value = "isFeatured", required = false) Boolean isFeatured,
			@RequestParam(value = "isPromotion", required = false) Boolean isPromotion,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			@RequestParam(value = "city", required = false) String city,
			@RequestParam(value = "tags", required = false) List<String> tags,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		PageImpl<HousingFacility> page = null;
		HousingResponse.HousingPage housingPage = null;
		List<ObjectId> tagIds = new ArrayList<ObjectId>();
		List<String> filterCriteria = new ArrayList<String>();
		try {

			if (null != tags) {
				for (String tagId : tags) {
					tagIds.add(new ObjectId(tagId));
				}
				filterCriteria.add("tags = " + tags);
			}

			Direction sortDirection = Direction.DESC;
			filterCriteria.add("direction = " + sortDirection);
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);
			filterCriteria.add("city = " + city);
			filterCriteria.add("isFeatured = " + isFeatured);
			filterCriteria.add("isPromotion = " + isPromotion);
			filterCriteria.add("pageIndex = " + pageIndex);
			filterCriteria.add("pageSize = " + pageSize);
			page = staticHousingRepository.getPage(city, tagIds, userId,
					isFeatured, isPromotion, pageable);
			housingPage = HousingResponse.getPage(page, currentUser);
		} catch (Exception e) {
			Util.handleException(e);
		}
		Util.logStats(staticMongoTemplate, request,
				"query for housing listing", null, null, null, null, null,
				filterCriteria, "getting housings based on filters applied",
				"SERVICES");
		return BYGenericResponseHandler.getResponse(housingPage);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/getRelated" }, produces = { "application/json" })
	@ResponseBody
	public Object getRelatedHousing(
			@RequestParam(value = "id", required = true) String id) {
		HousingFacility housingFacility = staticHousingRepository.findById(id);
		List<HousingFacility> housingFacilities = staticHousingRepository
				.findByUserId(housingFacility.getUserId());
		Map<String, List<HousingFacility>> housingMap = new HashMap<String, List<HousingFacility>>();
		for (HousingFacility housingFacility2 : housingFacilities) {
			if (null != housingFacility2.getPrimaryAddress()
					&& housingMap.get(housingFacility2.getPrimaryAddress()
							.getCity()) != null) {
				housingMap.get(housingFacility2.getPrimaryAddress().getCity())
						.add(housingFacility2);
			} else if (null != housingFacility2.getPrimaryAddress()) {
				List<HousingFacility> cityList = new ArrayList<HousingFacility>();
				cityList.add(housingFacility2);
				housingMap.put(housingFacility2.getPrimaryAddress().getCity(),
						cityList);
			} else {
				List<HousingFacility> cityList = housingMap.get(null);
				if (cityList != null) {
					cityList.add(housingFacility2);
				} else {
					cityList = new ArrayList<HousingFacility>();
					cityList.add(housingFacility2);
				}
				housingMap.put(null, cityList);
			}
		}
		return BYGenericResponseHandler.getResponse(housingMap);
	};

	@RequestMapping(method = { RequestMethod.GET }, value = { "" }, produces = { "application/json" })
	@ResponseBody
	public Object getHousingById(
			@RequestParam(value = "id", required = true) String housingId,
			HttpServletRequest request) {
		User currentUser = Util.getSessionUser(request);
		HousingFacility housingFacility = staticHousingRepository
				.findById(housingId);
		if (null == housingFacility) {
			throw new BYException(BYErrorCodes.NO_CONTENT_FOUND);
		}
		Util.logStats(staticMongoTemplate, request, "Detail for housing",
				currentUser != null ? currentUser.getId() : null,
				currentUser != null ? currentUser.getEmail() : null, housingId,
				null, null, Arrays.asList("housingId = " + housingId),
				"query for housing", "SERVICE");
		return BYGenericResponseHandler.getResponse(HousingResponse
				.getHousingEntity(housingFacility, currentUser));
	}

	public static List<HousingFacility> addFacilities(
			List<HousingFacility> facilities, User user) {
		List<HousingFacility> existingFacilities = staticHousingRepository
				.findByUserId(user.getId());

		ArrayList<HousingFacility> newlyAdded = new ArrayList<HousingFacility>(
				facilities);
		newlyAdded.removeAll(existingFacilities);

		ArrayList<HousingFacility> removed = new ArrayList<HousingFacility>(
				existingFacilities);
		removed.removeAll(facilities);

		ArrayList<HousingFacility> updated = new ArrayList<HousingFacility>(
				facilities);
		updated.retainAll(existingFacilities);

		for (HousingFacility removedFacility : removed) {
			staticMongoTemplate.remove(removedFacility);
			logHandler.addLog(removedFacility,
					ActivityLogConstants.CRUD_TYPE_DELETE, null, user);
		}

		for (HousingFacility addedFacility : newlyAdded) {
			addedFacility.setUserId(user.getId());
			HousingFacility newFacility = new HousingFacility();
			updateHousing(newFacility, addedFacility);
			newFacility.setLastModifiedAt(new Date());
			staticMongoTemplate.save(newFacility);
			logHandler.addLog(newFacility,
					ActivityLogConstants.CRUD_TYPE_CREATE, null, user);
			facilities.set(facilities.indexOf(addedFacility), newFacility);
		}

		for (HousingFacility updatedFacility : updated) {
			HousingFacility old = existingFacilities.get(existingFacilities
					.indexOf(updatedFacility));
			updateHousing(old, updatedFacility);
			old.setLastModifiedAt(new Date());
			staticMongoTemplate.save(old);
			logHandler.addLog(old, ActivityLogConstants.CRUD_TYPE_UPDATE, null,
					user);
		}

		return facilities;
	}

	public static void markVerified(String housingId, boolean isVerified) {
		HousingFacility housing = HousingController.staticMongoTemplate
				.findById(housingId, HousingFacility.class);
		if (null != housing) {
			housing.setVerified(isVerified);
			HousingController.staticMongoTemplate.save(housing);
		} else {
			throw new BYException(BYErrorCodes.NO_CONTENT_FOUND);
		}
	}

	public static Long getHousingCount() {
		return staticHousingRepository.getCount();
	}

	private static void updateHousing(HousingFacility oldHousing,
			HousingFacility newHousing) {
		oldHousing.setDescription(newHousing.getDescription());
		oldHousing.setName(newHousing.getName());
		oldHousing.setPhotoGalleryURLs(newHousing.getPhotoGalleryURLs());
		oldHousing.setPrimaryAddress(newHousing.getPrimaryAddress());
		oldHousing.setPrimaryEmail(newHousing.getPrimaryEmail());
		oldHousing.setPrimaryPhoneNo(newHousing.getPrimaryPhoneNo());
		oldHousing.setProfileImage(newHousing.getProfileImage());
		oldHousing.setSecondaryEmails(newHousing.getSecondaryEmails());
		oldHousing.setSecondaryPhoneNos(newHousing.getSecondaryPhoneNos());
		oldHousing.setWebsite(newHousing.getWebsite());
		oldHousing.setUserId(newHousing.getUserId());
		oldHousing.setCategoriesId(newHousing.getCategoriesId());
		if (!Util.isEmpty(newHousing.getDescription())) {
			org.jsoup.nodes.Document doc = Jsoup.parse(newHousing
					.getDescription());
			String domText = doc.text();
			if (domText.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH) {
				oldHousing.setShortDescription(Util.truncateText(domText));
			}
		}
		oldHousing.setSystemTags(newHousing.getSystemTags());
		oldHousing.setTier(newHousing.getTier());
	}

}
