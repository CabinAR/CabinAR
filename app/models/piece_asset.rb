class PieceAsset < ApplicationRecord 

  belongs_to :piece
  has_many_attached :assets

  after_create :set_names

  NAME_REGEX = /[^a-zA-Z\-0-9.]+/

  def to_builder
    Jbuilder.new do |json|
      json.id self.id
      json.code "<img id=\"#{self.id_name}\" src=\"/file/#{self.id}/#{self.filename}\" />"
    end
  end

  def filename(index=0)
    self.assets[index].blob.filename.to_s

  end

  def set_names
    self.update(name: self.assets[0].blob.filename.to_s.gsub(NAME_REGEX,"-"))

    self.assets.each do |asset|
      newfilename = asset.blob.filename.to_s.gsub(NAME_REGEX,"-")

      asset.blob.update(filename: newfilename)
    end
  end


  def id_name
    "file-#{self.id}-#{self.name}"
  end
end