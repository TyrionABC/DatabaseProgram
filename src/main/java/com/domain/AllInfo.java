package com.domain;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

public class AllInfo {
    List<String> directions;
    String title;
    String thesisType;
    String literatureLink;
    String publisherId;
    int flag;
    String text;
    String publishMeeting;
    String id;

    @Override
    public String toString() {
        return "AllInfo{" +
                "directions=" + directions +
                ", title='" + title + '\'' +
                ", thesisType='" + thesisType + '\'' +
                ", literatureLink='" + literatureLink + '\'' +
                ", publisherId='" + publisherId + '\'' +
                ", flag=" + flag +
                ", text='" + text + '\'' +
                ", publishMeeting='" + publishMeeting + '\'' +
                ", id='" + id + '\'' +
                ", publishTime=" + publishTime +
                ", publisher='" + publisher + '\'' +
                ", referIds=" + referIds +
                ", writers=" + writers +
                '}';
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @DateTimeFormat(pattern="yyyy-MM-dd")
    Date publishTime;

    String publisher;
    //引用的论文的id
    List<String> referIds;
    List<String> writers;

    public List<String> getDirections() {
        return directions;
    }

    public void setDirections(List<String> directions) {
        this.directions = directions;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getThesisType() {
        return thesisType;
    }

    public void setThesisType(String thesisType) {
        this.thesisType = thesisType;
    }

    public String getLiteratureLink() {
        return literatureLink;
    }

    public void setLiteratureLink(String literatureLink) {
        this.literatureLink = literatureLink;
    }

    public String getPublisherId() {
        return publisherId;
    }

    public void setPublisherId(String publisherId) {
        this.publisherId = publisherId;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getPublishMeeting() {
        return publishMeeting;
    }

    public void setPublishMeeting(String publishMeeting) {
        this.publishMeeting = publishMeeting;
    }

    public Date getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Date publishTime) {
        this.publishTime = publishTime;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public List<String> getReferIds() {
        return referIds;
    }

    public void setReferIds(List<String> referIds) {
        this.referIds = referIds;
    }

    public List<String> getWriters() {
        return writers;
    }

    public void setWriters(List<String> writers) {
        this.writers = writers;
    }
}
