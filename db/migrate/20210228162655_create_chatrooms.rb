class CreateChatrooms < ActiveRecord::Migration[6.1]
  def change
    create_table :chatrooms do |t|
      t.string :name
      t.string :privacy
      t.string :password
      t.references :owner, index: true, foreign_key: { to_table: :users}
      t.timestamps
    end
  end
end