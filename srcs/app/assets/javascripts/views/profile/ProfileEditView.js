AppClasses.Views.ProfileEdit = class extends Backbone.View {
    constructor(opts) {
        opts.events = {
            "submit #edit_user": "submit"
        }
        super(opts);
        this.tagName = "div";
        this.template = App.templates["profile/edit"];
        this.updateRender(); // render the template only one time, unless model changed
    }

    submit(e) {
        e.preventDefault();
        var url_img = $('#img_path').val();
        if ($('#image').val() != "") {
            var fd = new FormData();
            fd.append("image", $('#image')[0].files[0]);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.imgur.com/3/image.json", false);
            xhr.extraInfo = ""
            xhr.onload = function () {
                this.extraInfo = (JSON.parse(xhr.responseText)).data.link;
            }
            xhr.setRequestHeader('Authorization', 'Client-ID a504f6539d73d5b');
            xhr.send(fd);
            url_img = xhr.extraInfo;
        }
        let attr = {
            name: $('#user_nickname').val(),
            img_path: url_img,
            tfa: document.querySelector('.tfa_checkbox').checked,
            email: $('#user_email').val()
        };

        App.models.user.save(attr, {
            patch: true,
            error: function (model, response) {
                if (response.responseJSON != null)
                    alert(response.responseJSON.alert);
                else
                    alert("Unknown error while saving user");
                App.models.user.fetch(); // To reset the model to the db state
            },
            success: function () {
                App.routers.profile.navigate("/profile", {trigger: true})
            }
        });
    }

    updateRender() {
        this.$el.html(this.template({
	        current_user: App.models.user.toJSON(),
          user: App.models.user.toJSON(),
          token: $('meta[name="csrf-token"]').attr('content')
        }));
        return (this);
    }

    render() {
        return (this);
    }
}
