class Space < ApplicationRecord
  belongs_to :user
  has_many :pieces


  def as_json(with_pieces: false)
    super.merge({
      pieces: self.pieces.map { |p| p.to_builder.attributes! }
    })
  end

end