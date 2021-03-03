AppClasses.Routers.GameRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route('game/:room_id', 'play');
		this.route('game', 'index');
	};

	index() {
		this.renderView("GameIndexView");
		console.log("yes queen\n");
	}

	play(room_id) {
		room_id = Number(room_id);
		if (!Number.isInteger(room_id) || isNaN(room_id)) {
			console.log(`room_id '${room_id}' is not an integer apparently`);
			return (this.index());
		}
		this.renderViewWithParam('GamePlayView', room_id, {room_id});

		console.log(`room_id = ${room_id}, authenticity_token is ` + App.models.user.toJSON().log_token);
		let data = { authenticity_token: App.models.user.toJSON().log_token, room_nb: room_id }
		jQuery.post("/api/game/join", data)
			.done(usersData => {
				// empty is fine, needs to run async from rendering the view
			})
	}
}