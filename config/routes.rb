Rails.application.routes.draw do
  get 'app/show'
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' } do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount ActionCable.server => '/cable'

  namespace :api do

    resource :logins, only: [ :show, :create ]
    resources :spaces do
      resources :pieces, shallow: true do
        resources :assets, controller: "piece_assets", only: :create
      end
    end
  end

  get "/ar-file/:id/*name", to: "api/piece_assets#show"

  get "/app", to: redirect("/spaces")

  resources :spaces

  root to: "home#index"
end
