class SpaceUpdatesChannel < ApplicationCable::Channel
  def subscribed
    space = Space.where(id: params[:space_id]).first
    stream_for space
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
