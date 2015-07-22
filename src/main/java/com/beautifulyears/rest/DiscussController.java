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
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Controller;
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
import com.beautifulyears.util.WebPageParser;

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
	
	@RequestMapping(method = { RequestMethod.GET }, value = { "/getLinkInfo" }, produces = { "application/json" })
	@ResponseBody
	public Object getLinkInfo(@RequestParam(value = "url", required = true) String url) throws Exception{
		Discuss d = new Discuss();
		try {
			WebPageParser parser = new WebPageParser(url);
			d.setTitle(parser.getPageTitle());
			d.setText(parser.getDescription());
			d.setUserId(parser.getImage());;
		} catch (Exception e) {
			Util.handleException(e);
		}
		
		
		return BYGenericResponseHandler.getResponse(d);
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


	@RequestMapping(method = { RequestMethod.GET }, value = { "/page" }, produces = { "application/json" })
	@ResponseBody
	public Object getPage(
			@RequestParam(value = "discussType", required = false) String discussType,
			@RequestParam(value = "topicId", required = false) List<String> topicId,
			@RequestParam(value = "subTopicId", required = false) List<String> subTopicId,
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam(value = "isFeatured", required = false) Boolean isFeatured,
			@RequestParam(value = "sort", required = false, defaultValue = "createdAt") String sort,
			@RequestParam(value = "dir", required = false, defaultValue = "0") int dir,
			@RequestParam(value = "p", required = false, defaultValue = "0") int pageIndex,
			@RequestParam(value = "s", required = false, defaultValue = "10") int pageSize,
			HttpServletRequest request) throws Exception {
		LoggerUtil.logEntry();
		Page<Discuss> page = null;
		try {
			List<String> discussTypeArray = new ArrayList<String>();
			if (null == topicId && null == subTopicId) {
				topicId = new ArrayList<String>();
			} else if (null != subTopicId) {
				topicId = subTopicId;
			}
			if (null == discussType) {
				discussTypeArray.add("A");
				discussTypeArray.add("Q");
				discussTypeArray.add("P");
			} else {
				discussTypeArray.add(discussType);
			}

			Direction sortDirection = Direction.DESC;
			if (dir != 0) {
				sortDirection = Direction.ASC;
			}

			Pageable pageable = new PageRequest(pageIndex, pageSize,
					sortDirection, sort);
			page = discussRepository.getByCriteria(discussTypeArray, topicId,
					userId, isFeatured, pageable);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(DiscussResponse
				.getPage(page));
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/count" }, produces = { "application/json" })
	@ResponseBody
	public Object discussByDiscussTypeTopicAndSubTopicCount(
			@RequestParam(value = "topicId", required = false) List<String> topicId,
			@RequestParam(value = "subTopicId", required = false) List<String> subTopicId,
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam(value = "isFeatured", required = false) Boolean isFeatured)
			throws Exception {
		if (null == topicId && null == subTopicId) {
			topicId = new ArrayList<String>();
		} else if (null != subTopicId) {
			topicId = subTopicId;
		}

		LoggerUtil.logEntry();
		Map<String, Long> obj = new HashMap<String, Long>();
		try {

			Long articlesCount = discussRepository.getCountByCriteria(
					new String[] { "A" }, topicId, userId, isFeatured);
			Long questionsCount = discussRepository.getCountByCriteria(
					new String[] { "Q" }, topicId, userId, isFeatured);
			Long postsCount = discussRepository.getCountByCriteria(
					new String[] { "P" }, topicId, userId, isFeatured);
			obj.put("a", new Long(articlesCount));
			obj.put("q", new Long(questionsCount));
			obj.put("p", new Long(postsCount));
			obj.put("z", articlesCount + questionsCount + postsCount);

		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(obj);
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
