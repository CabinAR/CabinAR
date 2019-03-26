class Piece < ApplicationRecord
  belongs_to :user
  belongs_to :space

  enum marker_units: [ :inches, :feet, :meters ]

  has_one_attached :marker


  def to_builder
    Jbuilder.new do |json|
      json.(self, :id, :name, :published, :marker_units,:marker_width,:code)
      if self.marker.present?
        json.marker_url self.marker&.service_url
        json.marker_image_width self.marker.metadata["width"]
        json.marker_image_height self.marker.metadata["height"]
      end
    end
  end

end