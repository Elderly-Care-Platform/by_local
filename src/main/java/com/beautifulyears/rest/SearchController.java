package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.constants.UserTypes;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.HousingFacility;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.DiscussResponse;
import com.beautifulyears.rest.response.DiscussResponse.DiscussPage;
import com.beautifulyears.rest.response.HousingResponse;
import com.beautifulyears.rest.response.HousingResponse.HousingPage;
import com.beautifulyears.rest.response.PageImpl;
import com.beautifulyears.rest.response.UserProfileResponse;
import com.beautifulyears.rest.response.UserProfileResponse.UserProfilePage;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

/**
 * The REST based service for managing "search"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping(value = { "/search" })
public class SearchController {
	private MongoTemplate mongoTemplate;

	@Autowired
	public SearchController(MongoTemplate mongoTemplate) {
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/discussPageSearch" }, produces = { "application/json" })
	@ResponseBody
	public Object getDiscussPage(
			@RequestParam(value = "term", required = true) String term,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		DiscussPage discussPage = null;
		try {
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);

			TextCriteria criteria = TextCriteria.forDefaultLanguage()
					.matchingAny(term);

			Query query = TextQuery.queryText(criteria);
			query.addCriteria(Criteria.where("status").is(
					DiscussConstants.DISCUSS_STATUS_ACTIVE));
			query.with(pageable);

			System.out.println("search term  = " + term);

			List<Discuss> stories = this.mongoTemplate.find(query,
					Discuss.class);

			long total = this.mongoTemplate.count(query, Discuss.class);
			PageImpl<Discuss> storyPage = new PageImpl<Discuss>(stories,
					pageable, total);

			discussPage = DiscussResponse.getPage(storyPage, currentUser);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discussPage);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/servicePageSearch" }, produces = { "application/json" })
	@ResponseBody
	public Object getServicePage(
			@RequestParam(value = "term", required = true) String term,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			HttpServletRequest request) throws Exception {
		List<Integer> serviceTypes = new ArrayList<Integer>();
		serviceTypes.add(UserTypes.INSTITUTION_HOUSING);
		serviceTypes.add(UserTypes.INSTITUTION_NGO);
		serviceTypes.add(UserTypes.INSTITUTION_SERVICES);

		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		UserProfilePage profilePage = null;
		try {
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);

			TextCriteria criteria = TextCriteria.forDefaultLanguage()
					.matchingAny(term);

			Query query = TextQuery.queryText(criteria);
			query.with(pageable);

			query.addCriteria(Criteria.where("userTypes").in(serviceTypes));

			List<UserProfile> profiles = this.mongoTemplate.find(query,
					UserProfile.class);

			long total = this.mongoTemplate.count(query, UserProfile.class);
			PageImpl<UserProfile> storyPage = new PageImpl<UserProfile>(
					profiles, pageable, total);

			profilePage = UserProfileResponse.getPage(storyPage, currentUser);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(profilePage);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/housingPageSearch" }, produces = { "application/json" })
	@ResponseBody
	public Object getHousingPage(
			@RequestParam(value = "term", required = true) String term,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			HttpServletRequest request) throws Exception {

		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		HousingPage housingPage = null;
		try {
			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);

			TextCriteria criteria = TextCriteria.forDefaultLanguage()
					.matchingAny(term);

			Query query = TextQuery.queryText(criteria);
			query.with(pageable);

			List<HousingFacility> housings = this.mongoTemplate.find(query,
					HousingFacility.class);

			long total = this.mongoTemplate.count(query, HousingFacility.class);
			PageImpl<HousingFacility> page = new PageImpl<HousingFacility>(
					housings, pageable, total);

			housingPage = HousingResponse.getPage(page, currentUser);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(housingPage);
	}

}
