class PreviewsController < ApplicationController

  def show
    redirect_to "cabinar://space?space_id=#{params[:id].to_s}&cabin_key=#{params[:cabin_key.to_s]}"
  end
end