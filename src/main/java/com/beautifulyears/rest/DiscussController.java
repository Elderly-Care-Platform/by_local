package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.User;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.repository.TopicRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.DiscussResponse;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;

/**
 * The REST based service for managing "discuss"
 * 
 * @author jumpstart
 *
 */
@Controller
@RequestMapping(value = { "/discuss" })
public class DiscussController {
	private static final Logger logger = Logger
			.getLogger(DiscussController.class);
	private DiscussRepository discussRepository;
	private TopicRepository topicRepository;

	@Autowired
	public DiscussController(DiscussRepository discussRepository,
			TopicRepository topicRepository) {
		this.discussRepository = discussRepository;
		this.topicRepository = topicRepository;
	}

	@RequestMapping(consumes = { "application/json" }, value = { "/contactUs" })
	@ResponseBody
	public Object submitFeedback(@RequestBody Discuss discuss,
			HttpServletRequest request, HttpServletResponse res)
			throws Exception {
		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		if (null != currentUser) {
			discuss.setUserId(currentUser.getId());
			discuss.setUsername(currentUser.getUserName());
		}
		discuss.setDiscussType("F");
		discuss = discussRepository.save(discuss);
		logger.info("new feedback entity created with ID: " + discuss.getId());
		return BYGenericResponseHandler.getResponse(discuss);
	}

	@RequestMapping(consumes = { "application/json" })
	@ResponseBody
	public Object submitDiscuss(@RequestBody Discuss discuss,
			HttpServletRequest request, HttpServletResponse res)
			throws Exception {
		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		if (null != currentUser) {
			if (discuss == null || discuss.getId() == null
					|| discuss.getId().equals("")) {

				discuss.setUserId(currentUser.getId());
				discuss.setUsername(currentUser.getUserName());
				Discuss discussWithExtractedInformation = this
						.setDiscussBean(discuss);
				discuss = discussRepository
						.save(discussWithExtractedInformation);
				logger.info("new discuss entity created with ID: "
						+ discuss.getId() + " by User " + discuss.getUserId());

			} else {
				throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
			}
		} else {
			throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
		}
		return BYGenericResponseHandler.getResponse(discuss);

	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/all" }, produces = { "application/json" })
	@ResponseBody
	public Object allDiscuss(
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		DiscussResponse discussResponse = new DiscussResponse();
		try {
			Map<String, Object> filters = new HashMap<String, Object>();
			filters.put("discussType", "all");
			List<String> sortArray = new ArrayList<String>();
			sortArray.add(sort);
			List<Discuss> list = discussRepository.findPublished(filters,
					sortArray, 0);
			discussResponse.add(list, Util.getSessionUser(request));
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discussResponse
				.getResponse());

	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/all/{discussType}" }, produces = { "application/json" })
	@ResponseBody
	public Object showDiscussByDiscussType(
			@PathVariable(value = "discussType") String discussType,
			@RequestParam(value = "featured", required = false) Boolean isFeatured,
			@RequestParam(value = "count", required = false, defaultValue = "0") int count,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		DiscussResponse discussResponse = new DiscussResponse();
		try {
			Map<String, Object> filters = new HashMap<String, Object>();
			filters.put("isFeatured", isFeatured);
			filters.put("discussType", discussType);
			List<String> sortArray = new ArrayList<String>();
			sortArray.add(sort);
			List<Discuss> list = discussRepository.findPublished(filters,
					sortArray, count);
			discussResponse.add(list, Util.getSessionUser(request));
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discussResponse
				.getResponse());
	}
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/page" }, produces = { "application/json" })
	@ResponseBody
	public Object getPage(
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		DiscussResponse discussResponse = new DiscussResponse();
		Page<Discuss> page = null;
		try {
			Pageable pageable = new PageRequest(1, 5);
			page = discussRepository.findAll(pageable);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(page);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/all" }, produces = { "application/json" })
	@ResponseBody
	public Object allDiscussDiscussTypeAndTopic(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		DiscussResponse discussResponse = new DiscussResponse();
		try {
			Map<String, Object> filters = new HashMap<String, Object>();
			filters.put("discussType", discussType);
			filters.put("topicId", topicId);
			List<String> sortArray = new ArrayList<String>();
			sortArray.add(sort);
			List<Discuss> list = discussRepository.findPublished(filters,
					sortArray, 0);
			discussResponse.add(list, Util.getSessionUser(request));
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discussResponse
				.getResponse());
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/{subTopicId}/{userId}" }, produces = { "application/json" })
	@ResponseBody
	public Object allDiscussByUser(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId,
			@PathVariable(value = "userId") String userId,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		DiscussResponse discussResponse = new DiscussResponse();
		try {
			Map<String, Object> filters = new HashMap<String, Object>();
			filters.put("discussType", discussType);
			filters.put("topicId", topicId);
			filters.put("subTopicId", subTopicId);
			filters.put("userId", userId);
			List<String> sortArray = new ArrayList<String>();
			sortArray.add(sort);
			List<Discuss> list = discussRepository.findPublished(filters,
					sortArray, 0);
			discussResponse.add(list, Util.getSessionUser(request));
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discussResponse
				.getResponse());

	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/list/{discussType}/{topicId}/{subTopicId}" }, produces = { "application/json" })
	@ResponseBody
	public Object discussByDiscussTypeTopicAndSubTopic(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		DiscussResponse discussResponse = new DiscussResponse();
		try {
			Map<String, Object> filters = new HashMap<String, Object>();
			filters.put("discussType", discussType);
			filters.put("topicId", topicId);
			filters.put("subTopicId", subTopicId);
			List<String> sortArray = new ArrayList<String>();
			sortArray.add(sort);
			List<Discuss> list = discussRepository.findPublished(filters,
					sortArray, 0);
			discussResponse.add(list, Util.getSessionUser(request));

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discussResponse
				.getResponse());
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/count/{discussType}/{topicId}/{subTopicId}" }, produces = { "application/json" })
	@ResponseBody
	public Object discussByDiscussTypeTopicAndSubTopicCount(
			@PathVariable(value = "discussType") String discussType,
			@PathVariable(value = "topicId") String topicId,
			@PathVariable(value = "subTopicId") String subTopicId)
			throws Exception {
		LoggerUtil.logEntry();
		Map<String, Long> obj = new HashMap<String, Long>();

		try {

			Long articlesCount = discussRepository.getSize("A", topicId,
					subTopicId);
			Long questionsCount = discussRepository.getSize("Q", topicId,
					subTopicId);
			Long postsCount = discussRepository.getSize("P", topicId,
					subTopicId);
			obj.put("a", new Long(articlesCount));
			obj.put("q", new Long(questionsCount));
			obj.put("p", new Long(postsCount));
			obj.put("z", articlesCount + questionsCount + postsCount);

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(obj);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/show/{discussId}" }, produces = { "application/json" })
	@ResponseBody
	public Object showDiscuss(
			@PathVariable(value = "discussId") String discussId)
			throws Exception {
		LoggerUtil.logEntry();
		Discuss discuss = null;
		try {
			discuss = (Discuss) discussRepository.findOne(discussId);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discuss);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/{discussId}" }, produces = { "application/json" })
	@ResponseBody
	public Object getDiscuss(
			@PathVariable(value = "discussId") String discussId,
			HttpServletRequest req) {
		LoggerUtil.logEntry();
		DiscussResponse res = new DiscussResponse();
		Discuss discuss = (Discuss) discussRepository.findOne(discussId);
		if (null == discuss) {
			throw new BYException(BYErrorCodes.DISCUSS_NOT_FOUND);
		}
		return BYGenericResponseHandler.getResponse(res.getDiscussEntity(
				discuss, Util.getSessionUser(req)));
	}

	private Discuss setDiscussBean(Discuss discuss) throws Exception {
		LoggerUtil.logEntry();
		Discuss newDiscuss = null;
		try {

			String discussType = discuss.getDiscussType();
			String title = "";
			if (discussType.equalsIgnoreCase("A")) {
				title = discuss.getTitle();
			}
			String text = discuss.getText();
			int discussStatus = discuss.getStatus();
			List<String> topicId = discuss.getTopicId();
			List<String> systemTags = new ArrayList<String>();
			if (null != topicId && topicId.size() > 0) {
				systemTags = topicRepository.getTopicNames(topicId);
			}

			int aggrReplyCount = 0;
			newDiscuss = new Discuss(discuss.getUserId(),
					discuss.getUsername(), discussType, topicId, title, text,
					discussStatus, aggrReplyCount, systemTags,
					discuss.getUserTags(),
					discuss.getDiscussType().equals("A") ? discuss
							.getArticlePhotoFilename() : null, false);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return newDiscuss;
	}
}
