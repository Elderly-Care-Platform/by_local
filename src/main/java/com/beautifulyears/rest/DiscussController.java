package com.beautifulyears.rest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.ActivityLogConstants;
import com.beautifulyears.constants.BYConstants;
import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.LinkInfo;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.menu.Tag;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.repository.DiscussRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.DiscussResponse;
import com.beautifulyears.rest.response.DiscussResponse.DiscussPage;
import com.beautifulyears.rest.response.PageImpl;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.Util;
import com.beautifulyears.util.WebPageParser;
import com.beautifulyears.util.activityLogHandler.ActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.DiscussActivityLogHandler;
import com.beautifulyears.util.activityLogHandler.SharedActivityLogHandler;

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
	private MongoTemplate mongoTemplate;
	ActivityLogHandler<Discuss> logHandler;
	ActivityLogHandler<Object> shareLogHandler;

	@Autowired
	public DiscussController(DiscussRepository discussRepository,
			MongoTemplate mongoTemplate) {
		this.discussRepository = discussRepository;
		this.mongoTemplate = mongoTemplate;
		logHandler = new DiscussActivityLogHandler(mongoTemplate);
		shareLogHandler = new SharedActivityLogHandler(mongoTemplate);
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
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(currentUser.getId()));
			UserProfile profile = mongoTemplate.findOne(query,
					UserProfile.class);
			discuss.setUserProfile(profile);
		}
		discuss.setDiscussType("F");

		discuss = discussRepository.save(discuss);
		logHandler.addLog(discuss, ActivityLogConstants.CRUD_TYPE_CREATE,
				request);
		logger.info("new feedback entity created with ID: " + discuss.getId());
		return BYGenericResponseHandler.getResponse(discuss);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/getLinkInfo" }, produces = { "application/json" })
	@ResponseBody
	public Object getLinkInfo(
			@RequestParam(value = "url", required = true) String url)
			throws Exception {
		LinkInfo linkInfo = null;
		WebPageParser parser = null;
		try {
			parser = new WebPageParser(url);
		} catch (Exception e) {
			Util.handleException(e);
		} finally {
			if (parser != null) {
				linkInfo = parser.getUrlDetails();
			}
		}

		return BYGenericResponseHandler.getResponse(linkInfo);
	}

	@RequestMapping(method = { RequestMethod.POST }, consumes = { "application/json" })
	@ResponseBody
	public Object submitDiscuss(@RequestBody Discuss discuss,
			HttpServletRequest request, HttpServletResponse res)
			throws Exception {
		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		if (null != currentUser
				&& SessionController.checkCurrentSessionFor(request, "POST")) {
			if (discuss != null && (Util.isEmpty(discuss.getId()))) {

				discuss.setUserId(currentUser.getId());
				discuss.setUsername(currentUser.getUserName());
				Discuss discussWithExtractedInformation = this
						.setDiscussBean(discuss);
				discuss = discussRepository
						.save(discussWithExtractedInformation);
				logHandler.addLog(discuss,
						ActivityLogConstants.CRUD_TYPE_CREATE, request);
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

	@RequestMapping(method = { RequestMethod.PUT }, consumes = { "application/json" })
	@ResponseBody
	public Object editDiscuss(@RequestBody Discuss discuss,
			HttpServletRequest request, HttpServletResponse res)
			throws Exception {
		LoggerUtil.logEntry();
		User currentUser = Util.getSessionUser(request);
		if (null != currentUser
				&& SessionController.checkCurrentSessionFor(request, "POST")) {
			if (discuss != null && (!Util.isEmpty(discuss.getId()))) {
				if (BYConstants.USER_ROLE_EDITOR.equals(currentUser
						.getUserRoleId())
						|| BYConstants.USER_ROLE_SUPER_USER.equals(currentUser
								.getUserRoleId())
						|| discuss.getUserId().equals(currentUser.getId())) {
					Discuss oldDiscuss = mongoTemplate.findById(new ObjectId(
							discuss.getId()), Discuss.class);
					oldDiscuss.setText(discuss.getText());
					oldDiscuss.setTitle(discuss.getTitle());
					oldDiscuss.setTopicId(discuss.getTopicId());
					oldDiscuss.setArticlePhotoFilename(discuss
							.getArticlePhotoFilename());
					oldDiscuss.setLinkInfo(discuss.getLinkInfo());
					List<Tag> systemTags = new ArrayList<Tag>();
					for (Tag tag : discuss.getSystemTags()) {
						Tag newTag = mongoTemplate.findById(tag.getId(),
								Tag.class);
						systemTags.add(newTag);
					}
					Query query = new Query();
					query.addCriteria(Criteria.where("userId").is(
							discuss.getUserId()));
					UserProfile profile = mongoTemplate.findOne(query,
							UserProfile.class);
					oldDiscuss.setSystemTags(systemTags);
					oldDiscuss.setUserProfile(profile);
					discuss = discussRepository.save(oldDiscuss);
					logHandler.addLog(discuss,
							ActivityLogConstants.CRUD_TYPE_UPDATE, request);
					logger.info("new discuss entity created with ID: "
							+ discuss.getId() + " by User "
							+ discuss.getUserId());
				} else {
					throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
				}

			} else {
				throw new BYException(BYErrorCodes.NO_CONTENT_FOUND);
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
			// @RequestParam(value = "topicId", required = false) List<String>
			// topicId,
			// @RequestParam(value = "subTopicId", required = false)
			// List<String> subTopicId,
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
		User currentUser = Util.getSessionUser(request);
		PageImpl<Discuss> page = null;
		List<ObjectId> tagIds = new ArrayList<ObjectId>();
		DiscussPage discussPage = null;
		try {
			List<String> discussTypeArray = new ArrayList<String>();
			if (null == discussType) {
				// discussTypeArray.add("A");
				discussTypeArray.add("Q");
				discussTypeArray.add("P");
			} else {
				discussTypeArray.add(discussType);
			}

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
			page = discussRepository.getPage(discussTypeArray, tagIds, userId,
					isFeatured, isPromotion, pageable);
			discussPage = DiscussResponse.getPage(page, currentUser);
			// page = discussRepository.getByCriteria(discussTypeArray, topicId,
			// userId, isFeatured, pageable);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return BYGenericResponseHandler.getResponse(discussPage);
	}

	@RequestMapping(consumes = { "application/json" }, value = "addShare")
	@ResponseBody
	public Object submitShare(@RequestBody Discuss discuss,
			HttpServletRequest request) {
		Discuss sharedDiscuss = this.discussRepository.findOne(discuss.getId());
		if (null != sharedDiscuss) {
			sharedDiscuss.setShareCount(sharedDiscuss.getShareCount() + 1);
			this.discussRepository.save(sharedDiscuss);
			shareLogHandler.addLog(sharedDiscuss,
					ActivityLogConstants.CRUD_TYPE_CREATE, request);

		}
		return BYGenericResponseHandler.getResponse(sharedDiscuss);
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "/count" }, produces = { "application/json" })
	@ResponseBody
	public Object discussByDiscussTypeTopicAndSubTopicCount(
			// @RequestParam(value = "topicId", required = false) List<String>
			// topicId,
			// @RequestParam(value = "subTopicId", required = false)
			// List<String> subTopicId,
			@RequestParam(value = "tags", required = false) List<String> tags,
			@RequestParam(value = "userId", required = false) String userId,
			@RequestParam(value = "isFeatured", required = false) Boolean isFeatured,
			@RequestParam(value = "isPromotion", required = false) Boolean isPromotion,
			@RequestParam(value = "contentTypes", required = true) List<String> contentTypes)
			throws Exception {
		LoggerUtil.logEntry();
		Map<String, Long> obj = new HashMap<String, Long>();
		List<ObjectId> tagIds = new ArrayList<ObjectId>();
		try {

			if (null != tags) {
				for (String tagId : tags) {
					tagIds.add(new ObjectId(tagId));
				}
			}
			Long questionsCount = null;
			Long postsCount = null;
			Long featuredCount = null;
			if (contentTypes.contains("q")) {
				questionsCount = discussRepository.getCount(
						(new ArrayList<String>(Arrays.asList("Q"))), tagIds,
						userId, isFeatured, isPromotion);
				obj.put("q", new Long(questionsCount));
			}
			if (contentTypes.contains("p")) {
				postsCount = discussRepository.getCount((new ArrayList<String>(
						Arrays.asList("P"))), tagIds, userId, isFeatured,
						isPromotion);
				obj.put("p", new Long(postsCount));
			}
			if (contentTypes.contains("f")) {
				featuredCount = discussRepository.getCount(null, tagIds,
						userId, true, isPromotion);
				obj.put("featured", new Long(featuredCount));
			}
			if (contentTypes.contains("total")) {
				if (null == questionsCount) {
					questionsCount = discussRepository.getCount(
							(new ArrayList<String>(Arrays.asList("Q"))),
							tagIds, userId, isFeatured, isPromotion);
				}
				if (null == postsCount) {
					postsCount = discussRepository.getCount(
							(new ArrayList<String>(Arrays.asList("P"))),
							tagIds, userId, isFeatured, isPromotion);
				}
				obj.put("z", questionsCount + postsCount);
			}

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
			if (discussType.equalsIgnoreCase("P")) {
				title = discuss.getTitle();
			}
			String text = discuss.getText();
			int discussStatus = discuss.getStatus();
			List<String> topicId = discuss.getTopicId();
			List<Tag> systemTags = new ArrayList<Tag>();
			for (Tag tag : discuss.getSystemTags()) {
				Tag newTag = mongoTemplate.findById(tag.getId(), Tag.class);
				systemTags.add(newTag);
			}

			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(discuss.getUserId()));
			UserProfile profile = mongoTemplate.findOne(query,
					UserProfile.class);

			int aggrReplyCount = 0;
			newDiscuss = new Discuss(discuss.getUserId(),
					discuss.getUsername(), discussType, topicId, title, text,
					discussStatus, aggrReplyCount, systemTags,
					discuss.getShareCount(), discuss.getUserTags(),
					discuss.getDiscussType().equals("P") ? discuss
							.getArticlePhotoFilename() : null, false, false,
					discuss.getContentType(), discuss.getLinkInfo(), profile);
		} catch (Exception e) {
			Util.handleException(e);
		}
		return newDiscuss;
	}
}
