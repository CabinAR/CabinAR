class PieceAsset < ApplicationRecord 

  belongs_to :piece
  has_many_attached :assets

  after_create :set_names

  enum asset_type: [ :unknown, :image, :obj_mtl, :obj, :gltf ],  _prefix: true 

  NAME_REGEX = /[^a-zA-Z\-0-9.\_]+/

  def to_builder
    Jbuilder.new do |json|
      json.id self.id
      json.assets self.assets_code
      json.scene self.scene_code
    end
  end

  def filename(index=0)
    self.assets[index].blob.filename.to_s
  end

  def set_names
    self.update(name: self.assets[0].blob.filename.to_s.gsub(NAME_REGEX,"-").gsub(/\.[a-zA-Z0-9]{2,3}\z/,""),
      asset_type: self.calculate_asset_type
      )

    self.assets.each do |asset|
      newfilename = asset.blob.filename.to_s.gsub(NAME_REGEX,"-")

      asset.blob.update(filename: newfilename)
    end
  end


  def scene_code
    case self.asset_type
    when "obj"
      "<a-entity obj-model=\"obj: ##{id_name(obj_asset)};\"></a-entity>"
    else
      ""
    end
  end

  def assets_code
    case self.asset_type
    when "image"
      self.assets.map do |asset|
        asset_tag(asset,'img')
      end.join("\n")
    when "obj"
      asset_tag(obj_asset)
    when "obj_mtl"
      asset_tag(obj_asset) + "\n" + asset_tag(mtl_asset)
    when "gltf"
      asset_tag(gltf_asset)
    when "unknown"
      self.assets.map do |asset|
        asset_tag(asset)
      end.join("\n")
    end
  end

  def asset_tag(a, tag='a-asset-item')
    html = "<#{tag} id=\"#{id_name(a)}\" src=\"#{asset_url(a)}\""

    if tag == 'img'
      html + "/>"
    else
      html + "></#{tag}>"
    end
  end

  def obj_asset
    asset_by_extension("obj")
  end

  def mtl_asset
    asset_by_extension("mtl")
  end

  def gltf_asset
    asset_by_extension("gltf")
  end

  def asset_by_extension(extension)
     assets.to_a.detect { |a| a.blob.filename.extension.downcase == extension }
  end

  def calculate_asset_type
    if self.gltf_asset
      "gltf"
    elsif self.obj_asset
      if self.mtl_asset
        "obj_mtl"
      else
        "obj"
      end
    elsif asset_by_extension("jpg") ||
      asset_by_extension("png")
      "image"
    else
      "unknown"
    end

  end

  def asset_url(a)
    "/file/#{self.id}/#{a.blob.filename}"
  end

  def id_name(a)
    "file-#{self.id}-#{a.blob.filename.base}-#{a.blob.filename.extension}"
  end
end