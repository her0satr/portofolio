var Func = {
	ajax: function(p) {
		p.is_json = (p.is_json == null) ? true : p.is_json;
		
		jQuery.ajax({ type: 'POST', url: p.url, data: p.param, success: function(data) {
			if (p.is_json == 1) {
				eval('var result = ' + data);
				p.callback(result);
			} else {
				p.callback(data);
			}
		} });
	},
	array_to_json: function(data) {
		var temp = '';
		for (var i = 0; i < data.length; i++) {
			var raw = '';
			if (typeof(data[i]) == 'object') {
				raw = Func.object_to_json(data[i]);
			} else {
				raw = "'" + data[i] + "'";
			}
			
			temp = (temp.length == 0) ? raw : temp + ',' + raw;
		}
		return '[' + temp + ']';
	},
	datatable: function(p) {
		/*
		var param = {
			id: 'datatables',
			source: 'helper/datatable.php',
			column: [ { }, { }, { } , { bSortable: false, sClass: 'center' } ],
			callback: function() {
				$('#datatables .btn-detail').click(function() {
					var raw_record = $(this).siblings('.hide').text();
					eval('var record = ' + raw_record);
					
					Func.populate({ cnt: '#modal-submission', record: record });
					$('#modal-submission').modal();
				});
			}
		}
		var dt = Func.datatable(param);
		/*	*/
		var cnt_id = '#' + p.id;
		p.bFilter = (typeof(p.bFilter) == 'undefined') ? true : p.bFilter;
		p.bLengthChange = (typeof(p.bLengthChange) == 'undefined') ? true : p.bLengthChange;
		
		var dt_param = {
			"bFilter": p.bFilter,
			"bLengthChange": p.bLengthChange,
			"aoColumns": p.column,
			"sAjaxSource": p.source,
			"bProcessing": true, "bServerSide": true, "sServerMethod": "POST", "sPaginationType": "full_numbers",
			"oLanguage": {
				"sSearch": "<span>Search:</span> ",
				"sInfo": "Showing <span>_START_</span> to <span>_END_</span> of <span>_TOTAL_</span> entries",
				"sLengthMenu": "_MENU_ <span>entries per page</span>"
			},
			"fnDrawCallback": function (oSettings) {
				// init tooltips
				$('[rel=tooltip]').tooltip();
				$(cnt_id + ' .cursor-font-awesome').tooltip({ placement: 'top' });
				
				// styling row
				var counter = $(cnt_id).find('tbody tr').length;
				if (counter > 0) {
					for (var i = 0; i < counter; i++) {
						// coloring
						var color = $(cnt_id).find('tbody tr').eq(i).find('span.color').data('color');
						if (color != null) {
							$(cnt_id).find('tbody tr').eq(i).find('td').css('background', color);
						}
						
						// font
						var font = $(cnt_id).find('tbody tr').eq(i).find('span.font-weight');
						if (font.length > 0) {
							font.parents('tr').css('font-weight','bold')
						}
					}
				}
				
				if (p.callback != null) {
					p.callback();
				}
			}
		}
		if (p.fnServerParams != null) {
			dt_param.fnServerParams = p.fnServerParams;
		}
		if (p.aaSorting != null) {
			dt_param.aaSorting = p.aaSorting;
		}
		if (p.bPaginate != null) {
			dt_param.bPaginate = p.bPaginate;
		}
		
		var table = $(cnt_id).dataTable(dt_param);
		
		// initiate
		if (p.init != null) {
			p.init();
		}
		
		var dt = {
			table: table,
			reload: function() {
				if ($(cnt_id + '_paginate .paginate_active').length > 0) {
					$(cnt_id + '_paginate .paginate_active').click();
				} else {
					$(cnt_id + '_length select').change();
				}
			},
			refresh: function() {
				$(cnt_id + '_filter input').keyup();
			}
		}
		
		// init search
		$(cnt_id).parents('.panel-table').find('.btn-search').click(function() {
			var value = $(cnt_id).parents('.panel-table').find('.input-keyword').val();
			dt.table.fnFilter( value );
		});
		
		return dt;
	},
	get_name: function(value) {
		var result = value.trim().replace(new RegExp(/[^0-9a-z]+/gi), '_').toLowerCase();
		return result;
	},
	in_array: function(Value, Array) {
		var Result = false;
		for (var i = 0; i < Array.length; i++) {
			if (Value == Array[i]) {
				Result = true;
				break
			}
		}
		return Result;
	},
	is_empty: function(value) {
		var Result = false;
		if (value == null || value == 0) {
			Result = true;
		} else if (typeof(value) == 'string') {
			value = Helper.Trim(value);
			if (value.length == 0) {
				Result = true;
			}
		}
		
		return Result;
	},
	object_to_json: function(obj) {
		var str = '';
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				if (obj[p] != null) {
					str += (str.length == 0) ? str : ',';
					str += '"' + p + '":"' + obj[p] + '"';
				}
			}
		}
		str = '{' + str + '}';
		return str;
	},
	populate: function(p) {
		for (var form_name in p.record) {
			if (p.record.hasOwnProperty(form_name)) {
				var input = $(p.cnt + ' [name="' + form_name + '"]');
				var value = p.record[form_name];
				
				if (input.attr('type') == 'radio') {
					input.filter('[value=' + value.toString() + ']').prop('checked', true);
				} else if (input.attr('type') == 'checkbox') {
					input.prop('checked', false);
					if (value == 1) {
						input.prop('checked', true);
					}
				} else if (input.hasClass('input-datepicker')) {
					input.val(Func.swap_date(value));
				} else {
					input.val(value);
				}
			}
		}
	},
	swap_date: function(value) {
		if (value == null) {
			return '';
		}
		
		var array_value = value.split('-');
		if (array_value.length != 3) {
			return '';
		}
		
		var result = '';
		if (array_value[0].length == 4) {
			result = array_value[1] + '-' + array_value[2] + '-' + array_value[0];
		} else {
			result = array_value[2] + '-' + array_value[0] + '-' + array_value[1];
		}
		
		return result;
	},
	trim: function(value) {
		return value.replace(/^\s+|\s+$/g,'');
	},
    form: {
        get_value: function(container) {
			var PrefixCheck = container.substr(0, 1);
			if (! Func.in_array(PrefixCheck, ['.', '#'])) {
				container = '#' + container;
			}
			
            var data = Object();
			var set_value = function(obj, name, value) {
				if (typeof(name) == 'undefined') {
					return obj;
				} else if (name.length < 3) {
					obj[name] = value;
					return obj;
				}
				
				var endfix = name.substr(name.length - 2, 2);
				if (endfix == '[]') {
					var name_valid = name.replace(endfix, '');
					if (obj[name_valid] == null) {
						obj[name_valid] = [];
					}
					obj[name_valid].push(value);
				} else {
					obj[name] = value;
				}
				
				return obj;
			}
            
            var Input = jQuery(container + ' input, ' + container + ' select, ' + container + ' textarea');
            for (var i = 0; i < Input.length; i++) {
				var name = Input.eq(i).attr('name');
				var value = Input.eq(i).val();
				
				if (Input.eq(i).attr('type') == 'checkbox') {
					if (Input.eq(i).is(':checked')) {
						data = set_value(data, name, value);
					} else {
						data = set_value(data, name, 0);
					}
				} else if (Input.eq(i).attr('type') == 'radio') {
					value = $(container + ' [name="' + name + '"]:checked').val();
					data = set_value(data, name, value);
				} else if (Input.eq(i).hasClass('input-datepicker')) {
					data = set_value(data, name, Func.swap_date(value));
				} else if (Input.eq(i).hasClass('timepicker')) {
					if (value == '') {
					} else {
						var array_temp1 = value.split(' ');
						var array_temp2 = array_temp1[0].split(':');
						if (array_temp1[1] == 'AM') {
							var hour = parseInt(array_temp2[0], 10);
							if (hour == 12) {
								hour = 0;
							}
						} else if (array_temp1[1] == 'PM') {
							var hour = parseInt(array_temp2[0], 10);
							if (hour != 12) {
								hour += 12;
							}
						}
						hour = hour.toString();
						hour = (hour.length == 1) ? '0' + hour : hour;
						value = hour + ':' + array_temp2[1] + ':00';
					}
					data = set_value(data, name, value);
				} else {
					data = set_value(data, name, value);
				}
            }
			
            return data;
        },
		submit: function(p) {
			p.notify = (p.notify == null) ? true : p.notify;
			
			Func.ajax({ url: p.url, param: p.param, callback: function(result) {
				if (result.status == true) {
					if (p.notify) {
						if (result.message != null && result.message.length > 0) {
							$.notify(result.message, "success");
						}
					}
					
					if (p.callback != null) {
						p.callback(result);
					}
				} else {
					$.notify(result.message, "error");
					
					if (p.callback_error != null) {
						p.callback_error(result);
					}
				}
			} });
		},
		confirm: function(p) {
			p.title = (typeof(p.title) == 'undefined') ? 'Confirmation' : p.title;
			p.message = (typeof(p.message) == 'undefined') ? 'Are you sure ?' : p.message;
			
			var cnt_modal = '';
			cnt_modal += '<div id="cnt-confirm" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
			cnt_modal += '<div class="modal-dialog">';
			cnt_modal += '<div class="modal-content">';
			cnt_modal += '<div class="modal-header">';
			cnt_modal += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
			cnt_modal += '<h4 class="modal-title">' + p.title + '</h4>';
			cnt_modal += '</div>';
			cnt_modal += '<div class="modal-body">';
			cnt_modal += '<p>' + p.message + '</p>';
			cnt_modal += '</div>';
			cnt_modal += '<div class="modal-footer">';
			cnt_modal += '<button type="button" class="btn btn-primary">Yes</button>';
			cnt_modal += '<button type="button" class="btn btn-close btn-default" data-dismiss="modal" aria-hidden="true">No</button>';
			cnt_modal += '</div>';
			cnt_modal += '</div>';
			cnt_modal += '</div>';
			cnt_modal += '</div>';
			$('#cnt-temp').html(cnt_modal);
			$('#cnt-confirm').modal();
			
			$('#cnt-confirm .btn-primary').click(function() {
				if (typeof(p.url) == 'undefined') {
					if (p.callback != null) {
						p.callback();
						$('#cnt-confirm .btn-close').click();
					}
				}
				else {
					$.ajax({ type: "POST", url: p.url, data: p.data }).done(function( RawResult ) {
						eval('var result = ' + RawResult);
						
						$('#cnt-confirm .btn-close').click();
						if (result.status == 1) {
							$.notify(result.message, "success");
						} else {
							$.notify(result.message, "error");
						}
						
						if (p.callback != null) {
							p.callback();
						}
					});
				}
			});
		},
		confirm_delete: function(p) {
			p.title = (typeof(p.title) != 'undefined') ? p.title : 'Confirmation';
			p.message = (typeof(p.message) != 'undefined') ? p.message : 'Are you sure ?';
			
			var cnt_modal = '';
			cnt_modal += '<div id="cnt-confirm" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
			cnt_modal += '<div class="modal-dialog">';
			cnt_modal += '<div class="modal-content">';
			cnt_modal += '<div class="modal-header">';
			cnt_modal += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
			cnt_modal += '<h4 class="modal-title">' + p.title + '</h4>';
			cnt_modal += '</div>';
			cnt_modal += '<div class="modal-body">';
			cnt_modal += '<p>' + p.message + '</p>';
			cnt_modal += '</div>';
			cnt_modal += '<div class="modal-footer">';
			cnt_modal += '<button type="button" class="btn btn-primary">Yes</button>';
			cnt_modal += '<button type="button" class="btn btn-close btn-default" data-dismiss="modal" aria-hidden="true">No</button>';
			cnt_modal += '</div>';
			cnt_modal += '</div>';
			cnt_modal += '</div>';
			cnt_modal += '</div>';
			$('#cnt-temp').html(cnt_modal);
			$('#cnt-confirm').modal();
			
			$('#cnt-confirm .btn-primary').click(function() {
				if (typeof(p.url) != 'undefined') {
					$.ajax({ type: "POST", url: p.url, data: p.data }).done(function( RawResult ) {
						eval('var result = ' + RawResult);
						
						$('#cnt-confirm .btn-close').click();
						if (result.status == 1) {
							$.notify(result.message, "success");
						} else {
							$.notify(result.message, "error");
						}
						
						if (p.callback != null) {
							p.callback();
						}
					});
				}
				else {
					$('#cnt-confirm .btn-close').click();
					if (p.callback != null) {
						p.callback();
					}
				}
			});
		}
    },
	get_color: function(value) {
		var color = '#FF0000';
		if (value >= 90) {
			color = '#008000';
		} else if (value >= 80) {
			color = '#bacf0b';
		} else if (value >= 70) {
			color = '#e7912a';
		}
		
		return color;
	},
	html_decode: function(input) {
		var e = document.createElement('div');
		e.innerHTML = input;
		return e.childNodes[0].nodeValue;
	}
}

jQuery(document).ready(function() {
	// tooltips
	if (jQuery('[rel=tooltip]').tooltip != null) {
		jQuery('[rel=tooltip]').tooltip();
    }
});
