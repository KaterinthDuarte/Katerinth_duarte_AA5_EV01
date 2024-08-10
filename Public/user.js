
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const saltRounds = 10;

const  UserSchema = new mongoose.Schema(
    {
        usuario:   {type: String, required: true},
        password:  {type: String, required: true, unique:true}
    }
);

//Se realiza antes de que se ejecute y permite guardar contraseña

UserSchema.pre('save', function(next){  
     //valida si es nuevo o será modificado
    if(this.isNew || this.isModified('password')){
        const document = this;
          
        //encripta la contraseña (es un collback)
        bcrypt.hash(document.password, saltRounds, (err, hashedPassword)=>{  
            if(err){
                next(err);
            }else{
                document.password = hashedPassword;
                next();
            }
        })

    }else{
        //Redirige a la siguiente función
        next(); 
    }
});

UserSchema.methods.isCorrectPassword = function(password, collback){
    bcrypt.compare(password, this.password, function(err, same){
        if(err){
            collback(err);
        }else{
            collback(err, same);
        }
    });

}

module.exports = mongoose.model('User',UserSchema);
