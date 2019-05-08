class Space < ApplicationRecord
  belongs_to :user
  has_many :pieces

  scope :published, -> { where("1=1") }
  scope :by_user, -> (user) { where(user: user)}


  def as_json(with_pieces: false)
    if with_pieces
      super.merge({
        pieces: self.pieces.map { |p| p.to_builder.attributes! }
      })
    else
      super
    end
  end

end