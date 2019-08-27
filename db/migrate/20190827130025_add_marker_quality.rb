class AddMarkerQuality < ActiveRecord::Migration[6.0]
  def change
    add_column :pieces, :marker_quality, :integer
  end
end
