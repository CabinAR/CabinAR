class Space < ApplicationRecord
  belongs_to :user
  has_many :pieces,dependent: :destroy
  has_many :user_spaces, dependent: :destroy

  scope :published, -> { where(published: true) }
  scope :by_user, -> (user) { Space.where(id: UserSpace.where(user: user).pluck(:space_id)) }

  has_one_attached :icon

  after_create :create_admin_user_space

  def self.published_nearby_to(longitude,latitude) 
    Space.published.where("(ST_DistanceSphere(ST_MakePoint(spaces.longitude,spaces.latitude), ST_MakePoint(?,?)) <= radius) OR always_show",longitude,latitude)
  end


  def icon_url
    if ENV['ASSET_PATH'].blank?
      self.icon.service_url
    else
      "#{ENV['ASSET_PATH']}#{self.icon.key}"
    end
  end

  def add_user(user, admin: false)
    self.user_spaces.create(user: user, email: user.email, admin: admin)
  end

  def as_json(with_pieces: false, for_user: nil)
    Jbuilder.new do |json|
      json.(self,:id,:name,:longitude,:latitude,:radius,:tagline)

      json.editable self.can_edit?(for_user)

      if self.icon.present?
        json.icon_url self.icon_url
      end

      if with_pieces
        json.pieces self.pieces.map { |p| p.to_builder.attributes! }
      end
    end.attributes!
  end

  def self.create_default_for(user)
    space = Space.create(user: user,name: user.name + "'s Space")
    space.create_default_piece
    space
  end


  def can_edit?(user)
    user && (!self.locked? || user.admin_for?(self))
  end

  def create_default_piece
    piece = self.pieces.create({
      scene: '<a-sphere color="#FF0099" position="0 1"></a-sphere>
<a-entity text-geometry="value: Hello; bevelEnabled: true; bevelSize:.0; bevelThickness:.5; size:2" position="-2.5 2.5 0" material="color: #3300ff" scale=""></a-entity>',
      name: "hello",
      user: self.user,
      marker_units: "inches",
      marker_width: 8.5,
    })

    piece.marker.attach(io: File.open(Rails.root.join('app/assets/images/cabin-marker.png')), filename: "cabin-marker.png", content_type: "image/png")

    piece
  end

  def create_admin_user_space
    user_spaces.create(user: self.user, email: self.user.email, admin: true )
  end

end