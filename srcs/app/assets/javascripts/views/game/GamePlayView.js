AppClasses.Views.GamePlayView = class extends Backbone.View {
	constructor(options) {
		super(options);
		this.tagName = "div";
		this.template = App.templates["game/play"];
		this.room_id = 0;
		this.listenTo(App.collections.games, "change reset add remove", this.updateRender);
		this.updateRender();
	}

	updateRender() {
		// App.collections.games.myFetch();
		this.mydestroy();
		this.$el.html(this.template({
			current_user: App.models.user.toJSON(),
			token: $('meta[name="csrf-token"]').attr('content'),
			room_id: this.room_id
		}));
		return (this);
	}

	render(room_id) {
		this.room_id = room_id;
		this.updateRender();
		return (this);
	}


	mydestroy() {
		console.log("in GamePlayView#destroy");
		this.undelegateEvents();
		this.$el.removeData().unbind();
		this.remove();
	}
}
