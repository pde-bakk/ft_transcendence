AppClasses.Views.Friends = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"click .clickToAddFriend": "addFriend",
			"click .clickToAcceptFriend": "acceptFriend",
			"click .clickToRejectFriend": "rejectFriend",
			"click .clickToDeleteFriend": "deleteFriend"
		};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["friends/index"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change", this.updateRender);
		this.listenTo(this.collection, "change reset add remove", this.updateRender);
	}
	friendAction(event, url, msgSuccess) {
		// const userID = event.target.getElementsByClassName("nodisplay")[0].innerText;
        const userID = 1;
        const friendship = new AppClasses.Models.Friendship();
        let data = {authenticity_token: $('meta[name="csrf-token"]').attr('content'), id: userID};
        jQuery.post(url, data)
            .done(usersData => {
                console.log(msgSuccess);
                this.updateRender();
            })
            .fail(e => {
                console.log("Error in friendship");
            })
	}
	deleteFriend(e) {
		this.friendAction(e, "/api/friendships/destroy.json", "Friend deleted");
	}
	rejectFriend(e) {
		this.friendAction(e, "/api/friendships/reject.json", "Friend request rejected");
	}
	acceptFriend(e) {
		this.friendAction(e, "/api/friendships/accept.json", "Friend request accepted");
	}
	addFriend(e) {
		this.friendAction(e, "/api/friendships/add.json", "Request sent");
	}
	updateRender() {
        this.model.fetch();
        this.collection.fetch();
		this.$el.html(this.template({
			user: this.model.toJSON(),
			token: $('meta[name="csrf-token"]').attr('content'),
			allUsers: this.collection.toJSON()
		}));
		return (this);
	}
	render() {
		this.delegateEvents();
		return (this);
	}
}
