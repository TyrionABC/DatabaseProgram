package com.domain;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.util.Arrays;

@TableName("note_and_extra_file")
public class Note_and_extra_file {
    @TableId
    private String id;
    @TableField("publisher_id")
    private String publisherId;

    private String overview;

    private String note;
    @TableField("extra_file")
    private byte[] extraFile;

    private int flag;


    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public byte[] getExtraFile() {
        return extraFile;
    }

    public void setExtraFile(byte[] extraFile) {
        this.extraFile = extraFile;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPublisherId() {
        return publisherId;
    }

    public void setPublisherId(String publisherId) {
        this.publisherId = publisherId;
    }

    @Override
    public String toString() {
        return "Note_and_extra_file{" +
                "id='" + id + '\'' +
                ", publisherId='" + publisherId + '\'' +
                ", overview='" + overview + '\'' +
                ", note='" + note + '\'' +
                ", extraFile=" + Arrays.toString(extraFile) +
                ", flag=" + flag +
                '}';
    }

}