class Api::LoginsController < Api::BaseController


  def show
    if current_user
      render json: { user: current_user.as_json }
    else
      render json: { error: "Invalid user" }
    end
  end


  def create
    user = User.find_by_email(user_params[:email])

    if user
      if user.valid_password?(user_params[:password])
        user.generate_token!
        render json: user.as_json, status: :accepted
      else
        render json: { error: "Invalid username or password" }
      end
    else
      render json: { error: "No user with that username" }
    end
  end

  protected

  def user_params
    params.require(:user).permit(:email,
                                 :password
                                )
  end

end