class AddAlwaysShow < ActiveRecord::Migration[6.0]
  def change
    add_column :spaces, :always_show, :boolean, default: false
  end
end
