package com.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dao.NoteAndFileMapper;
import com.domain.Note_and_extra_file;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteAndFileServiceImp implements NoteAndFileService{
    @Autowired
    private NoteAndFileMapper noteAndFileMapper;
    @Override
    public void insert(Note_and_extra_file note) {
//        publisherId,flag,note,id
        System.out.println(note);
        Note_and_extra_file note_and_extra_file=noteAndFileMapper.selectNoteAndExtraFile(note.getId());
        if (note_and_extra_file==null){
            if (note.getOverview()==null)
            note.setOverview("");
            noteAndFileMapper.insert(note);//写论文时没有插入摘要，要创建笔记

        }
        else {
            noteAndFileMapper.updateById(note);//写论文时插入过overview，笔记已经存在
        }
    }

    @Override
    public void delete(String id) {
        QueryWrapper<Note_and_extra_file> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("id",id);
        noteAndFileMapper.delete(queryWrapper);
    }

    @Override
    public void update(Note_and_extra_file note_and_extra_file) {
        System.out.println(note_and_extra_file);
        if (this.select(note_and_extra_file.getId())==null)
            noteAndFileMapper.insert(note_and_extra_file);
        else
            noteAndFileMapper.updateById(note_and_extra_file);
    }

    @Override
    public Note_and_extra_file select(String id) {
        QueryWrapper<Note_and_extra_file> queryWrapper=new QueryWrapper<>();
        queryWrapper.eq("id",id);
        return noteAndFileMapper.selectOne(queryWrapper);
    }

    @Override
    public List<Note_and_extra_file> selectMyNotes(String userId) {
        return noteAndFileMapper.getMyNotes(userId);
    }
}
