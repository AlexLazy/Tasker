<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id');
            $table->bigInteger('project_id')->unsigned();
            $table->text('content');
            $table->string('price_total')->default('0');
            $table->string('price')->default('0');
            $table->enum('status', ['OPEN', 'CHECKS', 'CLOSED'])->default('OPEN');
            $table->timestamps();
        });
        Schema::table('tasks', function (Blueprint $table) {
          $table->foreign('project_id')
            ->references('id')
            ->on('projects')
            ->onDelete('cascade');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
}
