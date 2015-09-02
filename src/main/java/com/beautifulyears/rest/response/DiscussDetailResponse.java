/**
 * Jun 23, 2015
 * Nitin
 * 11:49:21 AM
 */
package com.beautifulyears.rest.response;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.beautifulyears.domain.Discuss;
import com.beautifulyears.domain.DiscussReply;
import com.beautifulyears.domain.User;
import com.beautifulyears.domain.UserProfile;
import com.beautifulyears.util.Util;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class DiscussDetailResponse implements IResponse {

	private List<DiscussReply> replies = new ArrayList<DiscussReply>();
	private DiscussResponse.DiscussEntity discuss;
	
	

	public DiscussResponse.DiscussEntity getDiscuss() {
		return discuss;
	}

	public void setDiscuss(DiscussResponse.DiscussEntity discuss) {
		this.discuss = discuss;
	}

	public List<DiscussReply> getReplies() {
		return replies;
	}

	public void setReplies(List<DiscussReply> replies) {
		this.replies = replies;
	}

	@Override
	@JsonIgnore
	public DiscussDetailResponse getResponse() {
		return this;
	}
	
	public void addDiscuss(Discuss discuss){
		DiscussResponse	discussResponse = new DiscussResponse();
		this.setDiscuss(discussResponse.getDiscussEntity(discuss, null));
	}
	
	public void addDiscuss(Discuss discuss,User user){
		DiscussResponse	discussResponse = new DiscussResponse();
		this.setDiscuss(discussResponse.getDiscussEntity(discuss,user));
	}

	public void addReplies(List<DiscussReply> replies,User user) {
		Map<String,DiscussReply> tempMap = new HashMap<String, DiscussReply>();
		List<DiscussReply> repliesList = new ArrayList<DiscussReply>();
		for (DiscussReply discussReply : replies) {
			if (discussReply.getUserProfile() != null) {
				UserProfile userProfile = new UserProfile();
				userProfile.getBasicProfileInfo().setProfileImage(
						discussReply.getUserProfile().getBasicProfileInfo()
								.getProfileImage());
				discussReply.setUserProfile(userProfile);
			}
			discussReply.setLikeCount(discussReply.getLikedBy().size());
			if (null != user && discussReply.getLikedBy().contains(user.getId())) {
				discussReply.setLikedByUser(true);
			}
			tempMap.put(discussReply.getId(), discussReply);
			if(!Util.isEmpty(discussReply.getParentReplyId()) && null != tempMap.get(discussReply.getParentReplyId())){
				tempMap.get(discussReply.getParentReplyId()).getReplies().add(discussReply);
			}else {
				repliesList.add(0, discussReply);
			}
			
		}
		setReplies(repliesList);
	}
}
