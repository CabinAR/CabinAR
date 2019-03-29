class Piece < ApplicationRecord
  belongs_to :user
  belongs_to :space

  enum marker_units: [ :inches, :feet, :meters ]

  has_one_attached :marker

  TO_METERS = {
    "inches" => (0.33 / 12),
    "feet" => 0.33,
    "meters" => 1
  }

  def marker_meter_width
    self.marker_width.to_i * (TO_METERS[self.marker_units].to_f)
  end

  def marker_meter_height
    marker_meter_width * 
      self.marker.metadata["height"].to_i /
      (self.marker.metadata['width'] || 1)
  end

  def to_builder
    Jbuilder.new do |json|
      json.(self, :id, :name, :published, :marker_units,:marker_width,:code)
      if self.marker.present? && self.marker_meter_height.present?
        json.marker_url self.marker&.service_url
        json.marker_image_width self.marker.metadata["width"]
        json.marker_image_height self.marker.metadata["height"]
        json.marker_meter_width self.marker_meter_width
        json.marker_meter_height self.marker_meter_height
      else
        if self.marker.present?
          json.marker_refresh true
        end

        json.marker_url nil
        json.marker_image_width nil
        json.marker_image_height nil
        json.marker_meter_width nil
        json.marker_meter_height nil
      end
    end
  end

end