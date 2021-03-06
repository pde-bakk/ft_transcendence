AppClasses.Views.NewWar = class extends Backbone.View {
    constructor(opts) {
        opts.events = {
            "submit #createWarForm": "submit"
        }
        super(opts);
        this.tagName = "div";
        this.template = App.templates["guilds/NewWar"];
        this.listenTo(App.collections.guilds, "change reset add remove", this.updateRender);
        this.updateRender();
    }

    submit(e) {
        e.preventDefault();
        let war = new AppClasses.Models.War();
        var today = new Date().toISOString().split('T')[0];

        var opponent_id = $('#opponent_id').val();
        var start_date = $('#start_date').val();
        var end_date = $('#end_date').val();
        var start_wt = $('#start_wt').val();
        var end_wt = $('#end_wt').val();
        var resp_time = $('#resp_time').val();
        var max_unanswered_match_calls = $('#max_unanswered_match_calls').val();
        var prize = $('#prize').val();
        var ladder = $('#ladder').is(':checked');
        var tournament = $('#tournament').is(':checked');
        var duel = $('#duel').is(':checked');
        var extra_speed = $('#extra_speed').is(':checked');
        var long_paddles = $('#long_paddles').is(':checked');

        var form_error = false;

        if (!opponent_id) {
            $('#opponent_id').removeClass('border-gray-300').addClass('border-red-700');
            form_error = true;
        } else {
            $('#opponent_id').removeClass('border-red-700').addClass('border-gray-300');
        }

        if (!resp_time || resp_time < 0) {
            $('#resp_time').removeClass('border-gray-300').addClass('border-red-700');
            form_error = true;
        } else {
            $('#resp_time').removeClass('border-red-700').addClass('border-gray-300');
        }
		    if (!max_unanswered_match_calls || max_unanswered_match_calls < 0) {
			    $('#max_unanswered_match_calls').removeClass('border-gray-300').addClass('border-red-700');
			    form_error = true;
		    } else {
			    $('#max_unanswered_match_calls').removeClass('border-red-700').addClass('border-gray-300');
		    }

        if (start_date >= end_date || !start_date || !end_date || start_date < today) {
            $('#end_date').removeClass('border-gray-300').addClass('border-red-700');
            $('#start_date').removeClass('border-gray-300').addClass('border-red-700');
            form_error = true;
        } else {
            $('#end_date').removeClass('border-red-700').addClass('border-gray-300');
            $('#start_date').removeClass('border-red-700').addClass('border-gray-300');
        }

        if (start_wt >= end_wt || !start_wt || !end_wt) {
            $('#end_wt').removeClass('border-gray-300').addClass('border-red-700');
            $('#start_wt').removeClass('border-gray-300').addClass('border-red-700');
            form_error = true;
        } else {
            $('#end_wt').removeClass('border-red-700').addClass('border-gray-300');
            $('#start_wt').removeClass('border-red-700').addClass('border-gray-300');
        }

        if (!prize || prize < 0) {
            $('#prize').removeClass('border-gray-300').addClass('border-red-700');
            form_error = true;
        } else {
            $('#prize').removeClass('border-red-700').addClass('border-gray-300');
        }

        if (form_error) {
            return;
        }

        let attr = {
        	authenticity_token: $('meta[name="csrf-token"]').attr('content'),
          guild1_id: App.models.user.toJSON().id,
          guild2_id: opponent_id,
          start: start_date,
          end: end_date,
          wt_begin: start_wt,
          wt_end: end_wt,
          prize: prize,
          time_to_answer: resp_time,
	        max_unanswered_match_calls: max_unanswered_match_calls,
          ladder: ladder,
          tournament: tournament,
          duel: duel,
          extra_speed: extra_speed,
	        long_paddles: long_paddles
        };

        war.save(attr, {
            error: function (model, response) {
                if (response)
                    alert(response.responseJSON.alert);
                else
                    alert("Unknown error while saving user");
                App.models.user.fetch(); // To reset the model to the db state
            },
            success: function(){
                App.models.user.fetch();
                App.routers.profile.navigate("/guilds", {trigger: true})
            }
        });
    }

    updateRender() {
        this.$el.html(this.template({
            current_user: App.models.user.toJSON(),
            users: App.collections.available_for_guild.toJSON(),
            guild: App.models.user.toJSON().guild,
            guilds_available: App.collections.guilds.toJSON(),
            token: $('meta[name="csrf-token"]').attr('content')
        }));
        var today = new Date().toISOString().split('T')[0];
        var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        $('#start_date').attr({"min" : today});
        $('#end_date').attr({"min" : tomorrow});
        return (this);
    }
    render() {
        return (this);
    }
}
