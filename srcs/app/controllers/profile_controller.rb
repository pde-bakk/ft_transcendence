class ProfileController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :connect_user
  def index
    @users = User.all
    @users.each do |usr|
      if (cookies[:log_token] == decrypt(usr.log_token))
        usr.current = true
      else
        usr.current = false
      end
    end
    render json: @users
  end

  def index_no_self
    @users = User.all.where.not(:id => @current_user.id)
    respond_to do |format|
      format.html { redirect_to "/", notice: '^^' }
      format.json { render json: @users, status: :ok }
    end
  end

  def index_not_banned
    @users = User.all.where.not(:ban => true)
    @users = @users.where.not(:id => @current_user.id)
    @users = @users.where.not(:owner => true)
    respond_to do |format|
      format.html {redirect_to "/", notice: '^' }
      format.json {render json: @users, status: :ok }
    end 
  end

  def index_not_admin
    @users = User.all.where.not(:admin => true)
    respond_to do |format|
      format.html {redirect_to "/", notice: '^' }
      format.json {render json: @users, status: :ok }
    end 
  end

  def index_admin_only
    @users = User.all.where.not(:admin => false)
    @users = @users.where.not(:owner => true)
    respond_to do |format|
      format.html {redirect_to "/", notice: '^' }
      format.json {render json: @users, status: :ok }
    end 
  end


  def changeAccount
   	if (!validate_input(params[:new_logtoken]))
      render json: {alert: "Input contains forbidden characters"}, status: :unprocessable_entity
		return
	end

	 User.all.each do |usr|
     if (decrypt(usr.log_token) == params[:new_logtoken])
       if (usr.tfa == false)
         cookies[:log_token] = params[:new_logtoken]
         @user = usr
       elsif (params[:bypass_tfa] == "true")
         if (params[:code_tfa] == cookies[:tfa_auth_code])
         cookies[:log_token] = params[:new_logtoken]
         @user = usr
         else
          render json: {alert: "tfa dude"}, status: :unauthorized
         end
       else
          cookies[:tar_log_tok] = params[:new_logtoken]
          tfa_code = ((rand() * 1000).to_i).to_s
          cookies[:tfa_auth_code] = tfa_code
          TfaMailer.with(tar_log_tok:params[:new_logtoken], tfa_auth_code: tfa_code).new_tfa_code.deliver_later
    	  render json: nil,status: :unauthorized
        end
     end 
    end
  end

  def getOwner
   	if (!validate_input(params[:passwd]))
      render json: {alert: "Input contains forbidden characters"}, status: :unprocessable_entity
		return
	end

  owner_found = false
  User.all.each do |usr|
    if (usr.owner == true)
      owner_found = true
    end 
  end
  if (owner_found == false)
    if (params[:passwd] == "securepwd")
      User.all.each do |usr|
        if (decrypt(usr.log_token) == cookies[:log_token])
          @user = usr
        end
      end
    @user.owner = true
    @user.admin = true
    @user.save
    else
      render json: {alert: "Nope, incorrect password"}, status: :unauthorized
    end
  else
      render json: {alert: "Website already has an owner"}, status: :unauthorized
  end
  end

  def show
    render json: User.clean(@current_user)
  end

  def update
    @user = User.find_by log_token: encrypt(cookies[:log_token])
    old_name = @user.name
	if (!validate_input(params[:name]))
      render json: {alert: "Username contains forbidden characters"}, status: :unprocessable_entity
		return
	end
	if (!validate_input(params[:email]))
      render json: {alert: "Email contains forbidden characters"}, status: :unprocessable_entity
		return
	end
    @user.name = params[:name]
    if (params[:img_path] == "")
      @user.img_path = "https://img2.cgtrader.com/items/2043799/e1982ff5ee/star-wars-rogue-one-solo-stormtrooper-helmet-3d-model-stl.jpg"
    else
      @user.img_path = params[:img_path]
    end
    @user.tfa = params[:tfa]
    @user.email = params[:email]
    @already_in_use = User.find_by name: params[:name]
    if @already_in_use && old_name != params[:name]
      render json: {alert: "Username is already taken"}, status: :unprocessable_entity
    elsif @user.save
      respond_to do |format|
        format.html { redirect_to "/#profile", notice: 'Profile was successfully updated.' }
        format.json { render json: User.clean(@user), status: :ok }
      end
    else
      render json: {alert: "There was an error saving your changes"}, status: :unprocessable_entity
    end
  end

  private

  def connect_user
    User.all.each do |usr|
      if cookies[:log_token] == decrypt(usr.log_token)
        @current_user = usr
      end
    end
  end
end
