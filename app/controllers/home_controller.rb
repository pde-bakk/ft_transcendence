require "oauth2"
require 'json'

def get_auth_tok()

  data = {grant_type: 'authorization_code', client_id: '0ebc0ed6e00f46a108cdcec53920e8bd00de8692aae747beee80e486feb5a6d2',
          client_secret: '66cb2e531d5ed30b5a53d185883f95964de1091cf1de07ece5766d04fa7830a6', code: params[:code],
          redirect_uri: 'http://127.0.0.1:3000/home'}
  uri = URI.parse('https://api.intra.42.fr/oauth/token')
  resp = Net::HTTP.post_form(uri, data)
  return (JSON.parse(resp.body)["access_token"])
end 

class HomeController < ApplicationController
@new_user_form = false
@user = nil
  def index
    if (!cookies[:atoken].present?)
      cookies[:atoken] = get_auth_tok()
    end 
      new_token = true
      User.all.each do |usr|
        if (cookies[:atoken] == usr.token)
          new_token = false
          @user = usr
        end
      end
      if (new_token == true)
        @user = User.new
        @user.token = cookies[:atoken]
        @user.name = "Set name in settings"
        @user.img_path = "https://img2.cgtrader.com/items/2043799/e1982ff5ee/star-wars-rogue-one-solo-stormtrooper-helmet-3d-model-stl.jpg"
        @user.reg_done = false
        @user.save()
        @new_user_form = true
      end
      if (@user.reg_done == true)
        @new_user_form = false
      else
        @new_user_form = true
      end
end
    def auth
      redirect_to "https://api.intra.42.fr/oauth/authorize?client_id=0ebc0ed6e00f46a108cdcec53920e8bd00de8692aae747beee80e486feb5a6d2&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fhome&response_type=code"
    end
  end
