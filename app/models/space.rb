class Space < ApplicationRecord
  belongs_to :user
  has_many :pieces,dependent: :destroy
  has_many :user_spaces, dependent: :destroy

  scope :published, -> { where("1=1") }
  scope :by_user, -> (user) { Space.where(id: UserSpace.where(user: user).pluck(:space_id)) }


  after_create :create_admin_user_space



  def as_json(with_pieces: false)
    if with_pieces
      super.merge({
        pieces: self.pieces.map { |p| p.to_builder.attributes! }
      })
    else
      super
    end
  end

  def self.create_default_for(user)
      space = Space.create(user: user,name: user.name + "'s Space")
      space.create_default_piece
      space
    end


  def create_default_piece
    self.pieces.create({
      scene: '<a-sphere color="#FF0099" position="0 1"></a-sphere>
<a-entity text-geometry="value: Hello; bevelEnabled: true; bevelSize:.0; bevelThickness:.5; size:2" position="-2.5 2.5 0" material="color: #3300ff" scale=""></a-entity>',
      name: "hello",
      user: self.user,
      marker_units: "inches",
      marker_width: 8.5
    })

  end

  def create_admin_user_space
    user_spaces.create(user: self.user, email: self.user.email, admin: true )
  end

end