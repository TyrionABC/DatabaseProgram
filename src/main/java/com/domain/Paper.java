package com.domain;


import com.baomidou.mybatisplus.annotation.TableField;

import java.util.Arrays;
import java.util.List;

//        研究方向
//        论文摘要
//        作者
//        发布人
//        会议
public class Paper {
    String id;
    String literatureLink;
    String publisherId;
    String thesisDate;
    String thesisType;
    String title;
    String path;
    String overview;
    String writerName;
    String publishMeeting;
    String text;
    List<String> paths;
    List<String> writers;

    @Override
    public String toString() {
        return "Paper{" +
                "id='" + id + '\'' +
                ", literatureLink='" + literatureLink + '\'' +
                ", publisherId='" + publisherId + '\'' +
                ", thesisDate='" + thesisDate + '\'' +
                ", thesisType='" + thesisType + '\'' +
                ", title='" + title + '\'' +
                ", path='" + path + '\'' +
                ", overview='" + overview + '\'' +
                ", writerName='" + writerName + '\'' +
                ", publishMeeting='" + publishMeeting + '\'' +
                ", text='" + text + '\'' +
                ", paths=" + paths +
                ", writers=" + writers +
                ", publisher='" + publisher + '\'' +
                ", flag=" + flag +
                ", like=" + like +
                '}';
    }

    public List<String> getWriters() {
        return writers;
    }

    public void setWriters(List<String> writers) {
        this.writers = writers;
    }

    public List<String> getPaths() {
        return paths;
    }

    public void setPaths(List<String> paths) {
        this.paths = paths;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }

    String publisher;
    //表明是否为草稿，1为草稿
    int flag;
    int like;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getThesisDate() {
        return thesisDate;
    }

    public void setThesisDate(String thesisDate) {
        this.thesisDate = thesisDate;
    }

    public String getThesisType() {
        return thesisType;
    }

    public void setThesisType(String thesisType) {
        this.thesisType = thesisType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getWriterName() {
        return writerName;
    }

    public void setWriterName(String writerName) {
        this.writerName = writerName;
    }

    public String getPublishMeeting() {
        return publishMeeting;
    }

    public void setPublishMeeting(String publishMeeting) {
        this.publishMeeting = publishMeeting;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public int getLike() {
        return like;
    }

    public void setLike(int like) {
        this.like = like;
    }

}
