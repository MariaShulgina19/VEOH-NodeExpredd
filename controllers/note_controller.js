const note_model = require('../models/note-model')

const note_views = require('../views/note_views');


const get_notes= (req, res, next) => {
    const user = req.user;
    user.populate('notes')
        .execPopulate()
        .then(() => {
            console.log('user:', user);
            let data = {                        //new
                user_name: user.name,           //new
                notes: user.notes               //new
            };                                  //new
            let html = note_views.notes_view(data);//new
            console.log('html:', html) //new
            res.send(html);
        });
};

const post_delete_note = (req, res, next) => {
    const user = req.user;
    const note_id_to_delete = req.body.note_id;

    //Remove note from user.notes
    const updated_notes = user.notes.filter((note_id) => {
        return note_id != note_id_to_delete;
    });
    user.notes = updated_notes;

    //Remove note object from database
    user.save().then(() => {
        note_model.findByIdAndRemove(note_id_to_delete).then(() => {
            res.redirect('/');
        });
    });
};


const get_note =(req, res, next) => {
    const note_id = req.params.id;
    note_model.findOne({
        _id: note_id
    }).then((note) => {
        res.send(note.text);
    });
};


module.exports.get_notes=get_notes;
module.exports.get_notes=get_note;
module.exports.post_notes=post_notes;
module.exports.post_delete_notes=post_delete_notes;


