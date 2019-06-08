class Piece < ApplicationRecord
  belongs_to :user
  belongs_to :space

  enum marker_units: [ :inches, :feet, :meters ]

  has_one_attached :marker

  has_many :piece_assets

  TO_METERS = {
    "inches" => (0.33 / 12),
    "feet" => 0.33,
    "meters" => 1
  }

  def marker_url
    if ENV['ASSET_PATH'].blank?
      self.marker.service_url
    else
      "#{ENV['ASSET_PATH']}#{self.marker.key}"
    end
  end


  def marker_meter_width
    self.marker_width.to_i * (TO_METERS[self.marker_units].to_f)
  end

  def marker_meter_height
    if self.marker.present? && self.marker.metadata["height"].present? 
      marker_meter_width * 
        self.marker.metadata["height"].to_i /
        (self.marker.metadata['width'] || 1)
    else
      marker_meter_width
    end
  end

  def to_builder
    Jbuilder.new do |json|
      json.(self, :id, :name, :published, :marker_units,:marker_width,:code, :scene, :assets)
      if self.marker_width.present? && self.marker.present?
        json.marker_url self.marker_url
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
        json.marker_meter_width marker_meter_width
        json.marker_meter_height marker_meter_height
      end
    end
  end

end