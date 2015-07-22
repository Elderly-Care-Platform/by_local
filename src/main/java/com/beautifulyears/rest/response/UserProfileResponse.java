/**
 * 
 */
package com.beautifulyears.rest.response;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;

import com.beautifulyears.domain.BasicProfileInfo;
import com.beautifulyears.domain.IndividualProfileInfo;
import com.beautifulyears.domain.ServiceProviderInfo;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;

/**
 * @author Nitin
 *
 */
public class UserProfileResponse implements IResponse {

	private List<UserProfileEntity> userProfileArray = new ArrayList<UserProfileEntity>();

	@Override
	public List<UserProfileEntity> getResponse() {
		return userProfileArray;
	}

	@SuppressWarnings("unused")
	private static class UserProfileEntity {
		private String id;
		private String userId;
		private List<Integer> userTypes = new ArrayList<Integer>();
		private BasicProfileInfo basicProfileInfo = new BasicProfileInfo();
		private IndividualProfileInfo individualInfo = new IndividualProfileInfo();
		private ServiceProviderInfo serviceProviderInfo = new ServiceProviderInfo();
		private Float aggrRating;
		private int ratingCount;
		private int reviewCount;
		private boolean isReviewedByUser = false;
		private boolean isRatedByUser = false;

		public UserProfileEntity(UserProfile profile, User user) {
			this.setId(profile.getId());
			this.setUserId(profile.getUserId());
			this.setUserTypes(profile.getUserTypes());
			this.setBasicProfileInfo(profile.getBasicProfileInfo());
			this.setIndividualInfo(profile.getIndividualInfo());
			this.setServiceProviderInfo(profile.getServiceProviderInfo());
			this.setAggrRating(profile.getAggrRating());
			if (null != user && profile.getRatedBy().contains(user.getId())) {
				this.setRatedByUser(true);
			}
			if (null != user && profile.getReviewedBy().contains(user.getId())) {
				this.setReviewedByUser(true);
			}
			ratingCount = profile.getRatedBy().size();
			reviewCount = profile.getReviewedBy().size();
		}

		public int getRatingCount() {
			return ratingCount;
		}

		public void setRatingCount(int ratingCount) {
			this.ratingCount = ratingCount;
		}

		public int getReviewCount() {
			return reviewCount;
		}

		public void setReviewCount(int reviewCount) {
			this.reviewCount = reviewCount;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getUserId() {
			return userId;
		}

		public void setUserId(String userId) {
			this.userId = userId;
		}

		public List<Integer> getUserTypes() {
			return userTypes;
		}

		public void setUserTypes(List<Integer> userTypes) {
			this.userTypes = userTypes;
		}

		public BasicProfileInfo getBasicProfileInfo() {
			return basicProfileInfo;
		}

		public void setBasicProfileInfo(BasicProfileInfo basicProfileInfo) {
			this.basicProfileInfo = basicProfileInfo;
		}

		public IndividualProfileInfo getIndividualInfo() {
			return individualInfo;
		}

		public void setIndividualInfo(IndividualProfileInfo individualInfo) {
			this.individualInfo = individualInfo;
		}

		public ServiceProviderInfo getServiceProviderInfo() {
			return serviceProviderInfo;
		}

		public void setServiceProviderInfo(
				ServiceProviderInfo serviceProviderInfo) {
			this.serviceProviderInfo = serviceProviderInfo;
		}

		public Float getAggrRating() {
			return aggrRating;
		}

		public void setAggrRating(Float aggrRating) {
			this.aggrRating = aggrRating;
		}

		public boolean isReviewedByUser() {
			return isReviewedByUser;
		}

		public void setReviewedByUser(boolean isReviewedByUser) {
			this.isReviewedByUser = isReviewedByUser;
		}

		public boolean isRatedByUser() {
			return isRatedByUser;
		}

		public void setRatedByUser(boolean isRatedByUser) {
			this.isRatedByUser = isRatedByUser;
		}

	}

	public static class UserProfilePage {
		private List<UserProfileEntity> content = new ArrayList<UserProfileEntity>();
		private boolean lastPage;
		private int number;

		public UserProfilePage() {
			super();
		}

		public UserProfilePage(Page<UserProfile> page, User user) {
			this.lastPage = page.isLastPage();
			this.number = page.getNumber();
			for (UserProfile profile : page.getContent()) {
				this.content.add(new UserProfileResponse.UserProfileEntity(
						profile, user));
			}
		}

		public List<UserProfileEntity> getContent() {
			return content;
		}

		public void setContent(List<UserProfileEntity> content) {
			this.content = content;
		}

		public boolean isLastPage() {
			return lastPage;
		}

		public void setLastPage(boolean lastPage) {
			this.lastPage = lastPage;
		}

		public int getNumber() {
			return number;
		}

		public void setNumber(int number) {
			this.number = number;
		}

	}

	public void add(UserProfile userProfile, User user) {
		this.userProfileArray.add(new UserProfileEntity(userProfile, user));
	}

	public void add(List<UserProfile> userProfiles, User user) {
		for (UserProfile userProfile : userProfiles) {
			this.userProfileArray.add(new UserProfileEntity(userProfile, user));
		}
	}

	public static UserProfilePage getPage(Page<UserProfile> page, User user) {
		UserProfilePage res = new UserProfilePage(page, user);
		return res;
	}

	public static UserProfileEntity getUserProfileEntity(
			UserProfile userProfile, User user) {
		return new UserProfileEntity(userProfile, user);
	}

}
