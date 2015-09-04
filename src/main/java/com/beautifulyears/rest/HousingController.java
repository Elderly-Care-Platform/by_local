/**
 * 
 */
package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

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

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.HousingRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.PageImpl;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

/**
 * @author Nitin
 *
 */

@Controller
@RequestMapping("/housing")
public class HousingController {
	private static HousingRepository staticHousingRepository;
	private static MongoTemplate staticMongoTemplate;

	// private static final Logger logger =
	// Logger.getLogger(HousingController.class);

	@Autowired
	public HousingController(HousingRepository housingRepository,
			MongoTemplate mongoTemplate) {
		staticHousingRepository = housingRepository;
		staticMongoTemplate = mongoTemplate;
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
			@RequestParam(value = "tags", required = false) List<String> tags,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		// User currentUser = Util.getSessionUser(request);
		PageImpl<HousingFacility> page = null;
		List<ObjectId> tagIds = new ArrayList<ObjectId>();
		try {

			if (null != tags) {
				for (String tagId : tags) {
					tagIds.add(new ObjectId(tagId));
				}
			}

			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);
			page = staticHousingRepository.getPage(tagIds, userId, isFeatured,
					isPromotion, pageable);
			// housingPage = DiscussResponse.getPage(page, currentUser);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(page);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "" }, produces = { "application/json" })
	@ResponseBody
	public Object getHousingById(
			@RequestParam(value = "id", required = true) String housingId) {
		HousingFacility housingFacility = staticHousingRepository.findById(housingId);
		if (null == housingFacility) {
			throw new BYException(BYErrorCodes.NO_CONTENT_FOUND);
		}
		return BYGenericResponseHandler.getResponse(housingFacility);
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
		}

		for (HousingFacility addedFacility : newlyAdded) {
			addedFacility.setUserId(user.getId());
			staticMongoTemplate.save(addedFacility);
			facilities.set(facilities.indexOf(addedFacility),addedFacility);
		}

		for (HousingFacility updatedFacility : updated) {
			HousingFacility old = existingFacilities.get(existingFacilities
					.indexOf(updatedFacility));
			updateHousing(old, updatedFacility);
			staticMongoTemplate.save(old);
		}

		return facilities;
	}

	public static void updateHousing(HousingFacility oldHousing,
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
		if(!Util.isEmpty(newHousing.getDescription())){
			org.jsoup.nodes.Document doc = Jsoup.parse(newHousing.getDescription());
			String domText = doc.text();
			if (domText.length() > DiscussConstants.DISCUSS_TRUNCATION_LENGTH) {
				oldHousing.setShortDescription(Util.truncateText(domText));
			}
		}
		oldHousing.setSystemTags(newHousing.getSystemTags());
		oldHousing.setTier(newHousing.getTier());
	}

}
