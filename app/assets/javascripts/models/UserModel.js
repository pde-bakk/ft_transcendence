AppClasses.Models.User = Backbone.Model.extend({
    url: "api/profile/1",

	defaults: {
		name: "",
		email: "",
        img_path: "",
        token: "",
        guild_id: 0,
        tfa: false,
        reg_done: false,
	log_token: 0,
	}
});

AppClasses.Collections.Users = Backbone.Collection.extend({
    url: "api/profile",
    model: AppClasses.Models.User
});

AppClasses.Models.Friendship = Backbone.Model.extend({
    defaults: {

    }
});

AppClasses.Collections.UsersNoSelf = class extends Backbone.Collection {
    constructor(opts) {
        super(opts);
        this.myFetch();
    }
    myFetch() {
        let data = {authenticity_token: $('meta[name="csrf-token"]').attr('content')};
        jQuery.post("/api/friendships/get_all.json", data)
            .done(usersData => {
                this.set(usersData);
            })
            .fail(e => {
                console.error(e);
            })
    }
};
