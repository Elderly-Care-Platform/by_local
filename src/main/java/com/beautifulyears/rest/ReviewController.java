package com.beautifulyears.rest;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.TypedAggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.beautifulyears.constants.DiscussConstants;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.domain.UserRating;
import com.beautifulyears.exceptions.BYErrorCodes;
import com.beautifulyears.exceptions.BYException;
import com.beautifulyears.mail.MailHandler;
import com.beautifulyears.repository.DiscussReplyRepository;
import com.beautifulyears.repository.UserProfileRepository;
import com.beautifulyears.repository.UserRatingRepository;
import com.beautifulyears.rest.response.BYGenericResponseHandler;
import com.beautifulyears.rest.response.DiscussDetailResponse;
import com.beautifulyears.util.LoggerUtil;
import com.beautifulyears.util.ResourceUtil;
import com.beautifulyears.util.Util;

@Controller
@RequestMapping("/reviewRate")
public class ReviewController {
	private Logger logger = Logger.getLogger(ReviewController.class);
	private DiscussReplyRepository discussReplyRepository;
	private UserRatingRepository userRatingRepository;
	private MongoTemplate mongoTemplate;
	private UserProfileRepository userProfileRepository;

	@Autowired
	public ReviewController(DiscussReplyRepository discussReplyRepository,
			UserRatingRepository userRatingRepository,
			UserProfileRepository userProfileRepository,
			MongoTemplate mongoTemplate) {
		this.discussReplyRepository = discussReplyRepository;
		this.userRatingRepository = userRatingRepository;
		this.userProfileRepository = userProfileRepository;
		this.mongoTemplate = mongoTemplate;
	}

	@RequestMapping(method = { RequestMethod.GET }, value = { "" }, produces = { "application/json" })
	@ResponseBody
	public Object getReviewRate(
			@RequestParam(value = "reviewContentType", required = true) Integer contentType,
			@RequestParam(value = "associatedId", required = true) String associatedId,
			@RequestParam(value = "userId", required = false) String userId,
			HttpServletRequest req, HttpServletResponse res) throws Exception {
		List<DiscussReply> reviewsList = new ArrayList<DiscussReply>();
		DiscussDetailResponse responseHandler = new DiscussDetailResponse();
		if (null != contentType && null != associatedId) {
			Query q = new Query();
			q.addCriteria(Criteria.where("replyType")
					.is(DiscussConstants.REPLY_TYPE_REVIEW).and("contentType")
					.is(contentType).and("discussId").is(associatedId));
			if (null != userId) {
				q.addCriteria(Criteria.where("userId").is(userId));
			}
			reviewsList = mongoTemplate.find(q, DiscussReply.class);
		} else {
			throw new BYException(BYErrorCodes.MISSING_PARAMETER);
		}
		responseHandler.addReplies(reviewsList, Util.getSessionUser(req));
		return BYGenericResponseHandler.getResponse(responseHandler
				.getResponse());

	}

	@RequestMapping(method = { RequestMethod.POST }, value = "", consumes = { "application/json" })
	@ResponseBody
	public Object submitReviewRate(
			@RequestParam(value = "reviewContentType", required = true) Integer contentType,
			@RequestParam(value = "associatedId", required = true) String associatedId,
			@RequestBody DiscussReply reviewRate, HttpServletRequest req,
			HttpServletResponse res) throws Exception {

		LoggerUtil.logEntry();
		try {

			User user = Util.getSessionUser(req);

			DiscussReply newReview = reviewRate;
			if (null != user) {
				if (null != contentType && null != associatedId
						&& null != newReview) {
					if (isSelfAccessment(associatedId, contentType, user)) {
						throw new BYException(BYErrorCodes.USER_NOT_AUTHORIZED);
					}
					submitRating(contentType, associatedId, newReview, user);
					submitReview(contentType, associatedId, newReview, user);
				} else {
					throw new BYException(BYErrorCodes.MISSING_PARAMETER);
				}
			} else {
				logger.debug("user must login to submit review aand ratings");
				throw new BYException(BYErrorCodes.USER_LOGIN_REQUIRED);
			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return null;
	}

	private DiscussReply submitReview(Integer contentType, String associatedId,
			DiscussReply newReviewRate, User user) {
		DiscussReply review = null;
		review = this.getReview(contentType, associatedId, user);
		if (null == review) {
			review = new DiscussReply();
			review.setDiscussId(associatedId);
			review.setUrl(newReviewRate.getUrl());
			review.setContentType(contentType);
			review.setUserRatingPercentage(newReviewRate
					.getUserRatingPercentage());
			review.setReplyType(DiscussConstants.REPLY_TYPE_REVIEW);
			review.setUserId(user.getId());
			review.setUserName(user.getUserName());
			Query query = new Query();
			query.addCriteria(Criteria.where("userId").is(user.getId()));
			UserProfile profile = mongoTemplate.findOne(query,
					UserProfile.class);
			review.setUserProfile(profile);
			sendMailForReview(review,user);
		}
		review.setText(newReviewRate.getText());
		review.setUserRatingPercentage(newReviewRate.getUserRatingPercentage());
		discussReplyRepository.save(review);
		updateAllDependantEntities(contentType, review);
		return review;
	}

	private UserRating submitRating(Integer contentType, String associatedId,
			DiscussReply reviewRate, User user) {
		UserRating rating = null;
		if (null != contentType && null != reviewRate && null != user) {
			rating = this.getRating(contentType, associatedId, user);
			if (null == rating && null != reviewRate.getUserRatingPercentage()) {
				rating = new UserRating();
				rating.setAssociatedId(associatedId);
				rating.setAssociatedContentType(contentType);
				rating.setUserId(user.getId());
				rating.setUserName(user.getUserName());
			}
			if (null != reviewRate.getUserRatingPercentage()
					&& (reviewRate.getUserRatingPercentage() < 0 || reviewRate
							.getUserRatingPercentage() > 100)) {
				throw new BYException(BYErrorCodes.RATING_VALUE_INVALID);
			}
			rating.setRatingPercentage(reviewRate.getUserRatingPercentage());
			userRatingRepository.save(rating);
			updateAllDependantEntities(contentType, rating);
		} else {
			logger.debug("not updating any rating");
		}
		return rating;
	}

	private UserRating getRating(Integer contentType, String associatedId,
			User user) {
		Query query = new Query();
		query.addCriteria(Criteria.where("associatedContentType")
				.is(contentType).and("associatedId").is(associatedId)
				.and("userId").is(user.getId()));
		return this.mongoTemplate.findOne(query, UserRating.class);
	}

	private DiscussReply getReview(Integer reviewContentType,
			String associatedId, User user) {
		Query query = new Query();
		query.addCriteria(Criteria.where("replyType")
				.is(DiscussConstants.REPLY_TYPE_REVIEW).and("contentType")
				.is(reviewContentType).and("discussId").is(associatedId)
				.and("userId").is(user.getId()));
		return this.mongoTemplate.findOne(query, DiscussReply.class);
	}

	private void updateAllDependantEntities(Integer contentType,
			UserRating rating) {
		switch (contentType) {
		case DiscussConstants.CONTENT_TYPE_INDIVIDUAL_PROFESSIONAL:
		case DiscussConstants.CONTENT_TYPE_INSTITUTION_SERVICES:
			updateInstitutionRating(rating);
			break;
		default:
			throw new BYException(BYErrorCodes.REVIEW_TYPE_INVALID);
		}
	}

	private void updateAllDependantEntities(Integer contentType,
			DiscussReply review) {
		switch (contentType) {
		case DiscussConstants.CONTENT_TYPE_INDIVIDUAL_PROFESSIONAL:
		case DiscussConstants.CONTENT_TYPE_INSTITUTION_SERVICES:
			updateInstitutionReviews(review);
			break;
		default:
			throw new BYException(BYErrorCodes.REVIEW_TYPE_INVALID);
		}
	}

	private void updateInstitutionRating(UserRating rating) {
		UserProfile profile = this.userProfileRepository.findOne(rating
				.getAssociatedId());
		if (null != profile) {
			if (null == rating.getRatingPercentage()
					|| 0 == rating.getRatingPercentage()) {
				profile.getRatedBy().remove(rating.getUserId());
			} else if (!profile.getRatedBy().contains(rating.getUserId())) {
				profile.getRatedBy().add(rating.getUserId());
			}
			TypedAggregation<UserRating> aggregation = newAggregation(
					UserRating.class,
					match(Criteria.where("associatedId")
							.is(rating.getAssociatedId())
							.and("associatedContentType")
							.is(rating.getAssociatedContentType())),
					group("associatedId").avg("ratingPercentage").as(
							"ratingPercentage"));

			AggregationResults<UserRating> result = mongoTemplate.aggregate(
					aggregation, UserRating.class);
			List<UserRating> ratingAggregated = result.getMappedResults();
			if (ratingAggregated.size() > 0) {
				profile.setAggrRatingPercentage(ratingAggregated.get(0)
						.getRatingPercentage());
			}

			this.userProfileRepository.save(profile);
		}
	}

	private void updateInstitutionReviews(DiscussReply review) {
		UserProfile profile = this.userProfileRepository.findOne(review
				.getDiscussId());
		if (null != profile) {
			if (Util.isEmpty(review.getText())) {
				profile.getReviewedBy().remove(review.getUserId());
			} else if (!profile.getReviewedBy().contains(review.getUserId())) {
				profile.getReviewedBy().add(review.getUserId());
			}
			this.userProfileRepository.save(profile);

		}
	}

	private boolean isSelfAccessment(String associatedId, Integer contentType,
			User user) throws Exception {
		boolean isSelf = false;
		try {
			switch (contentType) {
			case DiscussConstants.CONTENT_TYPE_INDIVIDUAL_PROFESSIONAL:
			case DiscussConstants.CONTENT_TYPE_INSTITUTION_SERVICES:
				UserProfile userProfile = this.userProfileRepository
						.findByUserId(user.getId());
				if (null != userProfile
						&& userProfile.getId().equals(associatedId)) {
					isSelf = true;
				}
				break;

			}
		} catch (Exception e) {
			Util.handleException(e);
		}
		return isSelf;
	}

	void sendMailForReview(DiscussReply review, User user) {
		try {
			UserProfile reviewedEntity = this.userProfileRepository.findOne(review
					.getDiscussId());
			if (!reviewedEntity.getUserId().equals(user.getId())) {
				ResourceUtil resourceUtil = new ResourceUtil(
						"mailTemplate.properties");
				User profileUser = UserController.getUser(reviewedEntity
						.getUserId());
				String userName = !Util.isEmpty(profileUser.getUserName()) ? profileUser
						.getUserName() : "Anonymous User";
				String replyTypeString = "profile";
				String path = review.getUrl();
				String body = MessageFormat.format(
						resourceUtil.getResource("reviewOnProfile"), userName, path);
				MailHandler.sendMailToUserId(reviewedEntity.getUserId(),
						"Your " + replyTypeString
								+ " was reviewed on beautifulYears.com", body);
			}
		} catch (Exception e) {
			logger.error(BYErrorCodes.ERROR_IN_SENDING_MAIL);
		}
	}

}
