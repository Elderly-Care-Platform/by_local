/**
 * 
 */
package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.HousingFacility;
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
	private HousingRepository housingRepository;

	// private static final Logger logger =
	// Logger.getLogger(HousingController.class);

	@Autowired
	public HousingController(HousingRepository housingRepository) {
		this.housingRepository = housingRepository;
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
			page = housingRepository.getPage(tagIds, userId, isFeatured,
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
		HousingFacility housingFacility = housingRepository.findById(housingId);
		if(null == housingFacility){
			throw new BYException(BYErrorCodes.NO_CONTENT_FOUND);
		}
		return BYGenericResponseHandler.getResponse(housingFacility);
	}

}
