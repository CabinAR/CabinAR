class FixUserSpaces < ActiveRecord::Migration[6.0]
  def change
    remove_column :user_spaces, :craeted_at
    add_column :user_spaces, :created_at, :datetime
    add_column :user_spaces, :admin, :boolean, default: false
  end
end
